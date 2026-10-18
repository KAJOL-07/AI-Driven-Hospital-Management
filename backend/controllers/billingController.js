const Billing = require("../models/Billing");
const Patient = require("../models/Patient");

const generateBillId = () => `BILL-${Math.floor(1000 + Math.random() * 9000)}`;

const calcTotals = (bill) => {
  const total = (parseFloat(bill.consultationFee) || 0) + (parseFloat(bill.bedCharges) || 0) +
    (parseFloat(bill.labCharges) || 0) + (parseFloat(bill.pharmacyCharges) || 0) + (parseFloat(bill.otherCharges) || 0);
  const paid = parseFloat(bill.paidAmount) || 0;
  const pending = Math.max(0, total - paid);
  const status = paid >= total ? "paid" : paid > 0 ? "partially_paid" : "pending";
  return { totalAmount: total, pendingAmount: pending, paymentStatus: status };
};

const getAllBills = async (req, res) => {
  try {
    const { patient_id, admission_id, payment_status, date_from, date_to } = req.query;
    const filter = { isDeleted: false };
    if (patient_id) filter.patientId = patient_id;
    if (admission_id) filter.admissionId = admission_id;
    if (payment_status) filter.paymentStatus = payment_status;
    if (date_from || date_to) {
      filter.createdAt = {};
      if (date_from) filter.createdAt.$gte = new Date(date_from);
      if (date_to) filter.createdAt.$lte = new Date(date_to);
    }

    const bills = await Billing.find(filter)
      .populate("patientId", "firstName lastName patientId")
      .sort({ createdAt: -1 })
      .lean();

    const mapped = bills.map(b => ({
      ...b,
      id: b._id,
      bill_id: b.billId,
      patient_id: b.patientId?._id,
      patient_name: b.patientId ? `${b.patientId.firstName} ${b.patientId.lastName}` : null,
      patient_code: b.patientId?.patientId || null,
      consultation_fee: b.consultationFee,
      bed_charges: b.bedCharges,
      lab_charges: b.labCharges,
      pharmacy_charges: b.pharmacyCharges,
      other_charges: b.otherCharges,
      total_amount: b.totalAmount,
      paid_amount: b.paidAmount,
      pending_amount: b.pendingAmount,
      payment_status: b.paymentStatus
    }));

    res.json({ success: true, message: "Bills retrieved.", data: mapped, count: mapped.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve bills.", error: error.message });
  }
};

const getBillById = async (req, res) => {
  try {
    const b = await Billing.findOne({ _id: req.params.id, isDeleted: false })
      .populate("patientId", "firstName lastName")
      .lean();

    if (!b) return res.status(404).json({ success: false, message: "Bill not found." });

    res.json({
      success: true,
      message: "Bill retrieved.",
      data: {
        ...b,
        id: b._id,
        bill_id: b.billId,
        patient_name: b.patientId ? `${b.patientId.firstName} ${b.patientId.lastName}` : null,
        consultation_fee: b.consultationFee,
        bed_charges: b.bedCharges,
        lab_charges: b.labCharges,
        pharmacy_charges: b.pharmacyCharges,
        other_charges: b.otherCharges,
        total_amount: b.totalAmount,
        paid_amount: b.paidAmount,
        pending_amount: b.pendingAmount,
        payment_status: b.paymentStatus
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve bill.", error: error.message });
  }
};

const getPatientBills = async (req, res) => {
  try {
    const bills = await Billing.find({ patientId: req.params.patientId, isDeleted: false })
      .sort({ createdAt: -1 })
      .lean();

    const mapped = bills.map(b => ({
      ...b,
      id: b._id,
      bill_id: b.billId,
      total_amount: b.totalAmount,
      paid_amount: b.paidAmount,
      pending_amount: b.pendingAmount,
      payment_status: b.paymentStatus
    }));

    res.json({ success: true, message: "Patient bills retrieved.", data: mapped, count: mapped.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve patient bills.", error: error.message });
  }
};

const createBill = async (req, res) => {
  try {
    const { patient_id, admission_id, consultation_fee, bed_charges, lab_charges, pharmacy_charges, other_charges, notes } = req.body;
    if (!patient_id) return res.status(400).json({ success: false, message: "patient_id is required." });

    const tempBill = {
      consultationFee: parseFloat(consultation_fee) || 0,
      bedCharges: parseFloat(bed_charges) || 0,
      labCharges: parseFloat(lab_charges) || 0,
      pharmacyCharges: parseFloat(pharmacy_charges) || 0,
      otherCharges: parseFloat(other_charges) || 0,
      paidAmount: 0
    };
    const { totalAmount, pendingAmount, paymentStatus } = calcTotals(tempBill);

    const newBill = await Billing.create({
      billId: generateBillId(),
      patientId: patient_id,
      admissionId: admission_id || null,
      consultationFee: tempBill.consultationFee,
      bedCharges: tempBill.bedCharges,
      labCharges: tempBill.labCharges,
      pharmacyCharges: tempBill.pharmacyCharges,
      otherCharges: tempBill.otherCharges,
      totalAmount,
      paidAmount: 0,
      pendingAmount,
      paymentStatus,
      notes: notes || null,
      isDeleted: false
    });

    res.status(201).json({ success: true, message: "Bill created.", data: newBill });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create bill.", error: error.message });
  }
};

const updateBill = async (req, res) => {
  try {
    const { consultation_fee, bed_charges, lab_charges, pharmacy_charges, other_charges, notes } = req.body;
    const current = await Billing.findOne({ _id: req.params.id, isDeleted: false });
    if (!current) return res.status(404).json({ success: false, message: "Bill not found." });

    if (consultation_fee !== undefined) current.consultationFee = parseFloat(consultation_fee);
    if (bed_charges !== undefined) current.bedCharges = parseFloat(bed_charges);
    if (lab_charges !== undefined) current.labCharges = parseFloat(lab_charges);
    if (pharmacy_charges !== undefined) current.pharmacyCharges = parseFloat(pharmacy_charges);
    if (other_charges !== undefined) current.otherCharges = parseFloat(other_charges);
    if (notes !== undefined) current.notes = notes;

    const { totalAmount, pendingAmount, paymentStatus } = calcTotals(current);
    current.totalAmount = totalAmount;
    current.pendingAmount = pendingAmount;
    current.paymentStatus = paymentStatus;

    await current.save();

    res.json({ success: true, message: "Bill updated.", data: current });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update bill.", error: error.message });
  }
};

const processPayment = async (req, res) => {
  try {
    const { payment_amount } = req.body;
    if (!payment_amount || parseFloat(payment_amount) <= 0) {
      return res.status(400).json({ success: false, message: "payment_amount must be a positive number." });
    }

    const current = await Billing.findOne({ _id: req.params.id, isDeleted: false });
    if (!current) return res.status(404).json({ success: false, message: "Bill not found." });

    const newPaid = parseFloat(current.paidAmount) + parseFloat(payment_amount);
    current.paidAmount = Math.min(newPaid, current.totalAmount);
    current.pendingAmount = Math.max(0, current.totalAmount - current.paidAmount);
    current.paymentStatus = current.paidAmount >= current.totalAmount ? "paid" : "partially_paid";

    await current.save();

    res.json({ success: true, message: "Payment processed.", data: current });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to process payment.", error: error.message });
  }
};

const getBillingStats = async (req, res) => {
  try {
    const bills = await Billing.find({ isDeleted: false }).lean();
    let total_revenue = 0, total_collected = 0, total_pending = 0;
    const statusMap = { paid: 0, partially_paid: 0, pending: 0 };

    bills.forEach(b => {
      total_revenue += b.totalAmount || 0;
      total_collected += b.paidAmount || 0;
      total_pending += b.pendingAmount || 0;
      if (statusMap[b.paymentStatus] !== undefined) statusMap[b.paymentStatus]++;
    });

    res.json({
      success: true,
      message: "Billing stats retrieved.",
      data: {
        total_bills: bills.length,
        total_revenue,
        total_collected,
        total_pending,
        ...statusMap
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get billing stats.", error: error.message });
  }
};

const deleteBill = async (req, res) => {
  try {
    const updated = await Billing.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Bill not found." });
    res.json({ success: true, message: "Bill deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete bill.", error: error.message });
  }
};

module.exports = {
  getAllBills,
  getBillById,
  createBill,
  updateBill,
  processPayment,
  deleteBill,
  getBillingStats,
  getPatientBills
};
