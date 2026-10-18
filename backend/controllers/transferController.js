const Transfer = require("../models/Transfer");
const Patient = require("../models/Patient");
const Ward = require("../models/Ward");
const Bed = require("../models/Bed");
const Admission = require("../models/Admission");
const User = require("../models/User");
const Notification = require("../models/Notification");

const generateTransferId = () => `TRF-${Math.floor(1000 + Math.random() * 9000)}`;

// GET /api/transfers
const getAllTransfers = async (req, res) => {
  try {
    const { status, patient_id, source_ward_id, destination_ward_id } = req.query;
    const filter = { isDeleted: false };
    if (status) filter.status = status;
    if (patient_id) filter.patientId = patient_id;
    if (source_ward_id) filter.sourceWardId = source_ward_id;
    if (destination_ward_id) filter.destinationWardId = destination_ward_id;

    const transfers = await Transfer.find(filter)
      .populate("patientId", "firstName lastName patientId age gender")
      .populate("sourceWardId", "name")
      .populate("destinationWardId", "name")
      .populate("sourceBedId", "bedNumber")
      .populate("destinationBedId", "bedNumber")
      .populate("requestedById", "name")
      .populate("approvedById", "name")
      .sort({ createdAt: -1 })
      .lean();

    const mapped = transfers.map(t => ({
      ...t,
      id: t._id,
      transfer_id: t.transferId,
      patient_id: t.patientId?._id,
      patient_name: t.patientId ? `${t.patientId.firstName} ${t.patientId.lastName}` : null,
      patient_code: t.patientId?.patientId || null,
      age: t.patientId?.age || null,
      gender: t.patientId?.gender || null,
      source_ward_name: t.sourceWardId?.name || null,
      destination_ward_name: t.destinationWardId?.name || null,
      source_bed_number: t.sourceBedId?.bedNumber || null,
      destination_bed_number: t.destinationBedId?.bedNumber || null,
      requested_by_name: t.requestedById?.name || null,
      approved_by_name: t.approvedById?.name || null,
      clinical_reason: t.clinicalReason
    }));

    res.json({ success: true, message: "Transfers retrieved.", data: mapped, count: mapped.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve transfers.", error: error.message });
  }
};

// GET /api/transfers/active
const getActiveTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find({
      status: { $in: ["requested", "pending_approval", "approved", "in_progress"] },
      isDeleted: false
    })
      .populate("patientId", "firstName lastName")
      .populate("sourceWardId", "name")
      .populate("destinationWardId", "name")
      .sort({ createdAt: -1 })
      .lean();

    const mapped = transfers.map(t => ({
      ...t,
      id: t._id,
      transfer_id: t.transferId,
      patient_name: t.patientId ? `${t.patientId.firstName} ${t.patientId.lastName}` : null,
      source_ward_name: t.sourceWardId?.name || null,
      destination_ward_name: t.destinationWardId?.name || null
    }));

    res.json({ success: true, message: "Active transfers retrieved.", data: mapped, count: mapped.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve active transfers.", error: error.message });
  }
};

// GET /api/transfers/stats
const getTransferStats = async (req, res) => {
  try {
    const transfers = await Transfer.find({ isDeleted: false }).lean();
    let pending = 0, approved = 0, in_progress = 0, completed = 0, rejected = 0;

    transfers.forEach(t => {
      if (["requested", "pending_approval"].includes(t.status)) pending++;
      else if (t.status === "approved") approved++;
      else if (t.status === "in_progress") in_progress++;
      else if (t.status === "completed") completed++;
      else if (t.status === "rejected") rejected++;
    });

    res.json({
      success: true,
      message: "Transfer stats retrieved.",
      data: {
        total: transfers.length,
        pending,
        approved,
        in_progress,
        completed,
        rejected
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get transfer stats.", error: error.message });
  }
};

// GET /api/transfers/:id
const getTransferById = async (req, res) => {
  try {
    const t = await Transfer.findOne({ _id: req.params.id, isDeleted: false })
      .populate("patientId", "firstName lastName")
      .populate("sourceWardId", "name")
      .populate("destinationWardId", "name")
      .populate("sourceBedId", "bedNumber")
      .populate("destinationBedId", "bedNumber")
      .lean();

    if (!t) return res.status(404).json({ success: false, message: "Transfer request not found." });

    res.json({
      success: true,
      message: "Transfer request retrieved.",
      data: {
        ...t,
        id: t._id,
        transfer_id: t.transferId,
        patient_name: t.patientId ? `${t.patientId.firstName} ${t.patientId.lastName}` : null,
        source_ward_name: t.sourceWardId?.name || null,
        destination_ward_name: t.destinationWardId?.name || null,
        source_bed_number: t.sourceBedId?.bedNumber || null,
        destination_bed_number: t.destinationBedId?.bedNumber || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve transfer request.", error: error.message });
  }
};

// POST /api/transfers
const createTransfer = async (req, res) => {
  try {
    const { patient_id, destination_ward_id, clinical_reason, priority, destination_bed_id } = req.body;
    if (!patient_id || !destination_ward_id || !clinical_reason) {
      return res.status(400).json({ success: false, message: "patient_id, destination_ward_id, and clinical_reason are required." });
    }

    const patient = await Patient.findOne({ _id: patient_id, status: { $ne: "deleted" } });
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found." });

    if (patient.admissionStatus !== "admitted") {
      return res.status(400).json({ success: false, message: "Patient must be currently admitted to request inter-ward transfer." });
    }

    if (patient.currentWardId && patient.currentWardId.toString() === destination_ward_id.toString()) {
      return res.status(400).json({ success: false, message: "Destination ward cannot be the same as the current ward." });
    }

    const transfer_id = generateTransferId();
    const newTrf = await Transfer.create({
      transferId: transfer_id,
      patientId: patient_id,
      sourceWardId: patient.currentWardId,
      sourceBedId: patient.currentBedId || null,
      destinationWardId: destination_ward_id,
      destinationBedId: destination_bed_id || null,
      priority: priority || "urgent",
      clinicalReason: clinical_reason.trim(),
      requestedById: req.user?._id || req.user?.id || null,
      status: "pending_approval",
      isDeleted: false
    });

    await Notification.create({
      title: "Transfer Request Submitted",
      message: `Transfer ${transfer_id} requested for patient ID ${patient_id}.`,
      type: "transfer",
      relatedId: newTrf._id,
      relatedType: "transfer"
    });

    res.status(201).json({ success: true, message: "Transfer request submitted.", data: newTrf });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to submit transfer request.", error: error.message });
  }
};

// PATCH /api/transfers/:id/approve
const approveTransfer = async (req, res) => {
  try {
    const { destination_bed_id } = req.body;
    const transfer = await Transfer.findOne({ _id: req.params.id, isDeleted: false });
    if (!transfer) return res.status(404).json({ success: false, message: "Transfer request not found." });

    transfer.status = "approved";
    transfer.approvedById = req.user?._id || req.user?.id || null;
    if (destination_bed_id) transfer.destinationBedId = destination_bed_id;
    await transfer.save();

    await Notification.create({
      title: "Transfer Request Approved",
      message: `Transfer ${transfer.transferId} has been approved.`,
      type: "transfer",
      relatedId: transfer._id,
      relatedType: "transfer"
    });

    res.json({ success: true, message: "Transfer request approved." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to approve transfer request.", error: error.message });
  }
};

// PATCH /api/transfers/:id/reject
const rejectTransfer = async (req, res) => {
  try {
    const { rejection_reason } = req.body;
    const transfer = await Transfer.findOne({ _id: req.params.id, isDeleted: false });
    if (!transfer) return res.status(404).json({ success: false, message: "Transfer request not found." });

    transfer.status = "rejected";
    transfer.rejectionReason = rejection_reason || "Declined by authorized staff";
    transfer.approvedById = req.user?._id || req.user?.id || null;
    await transfer.save();

    res.json({ success: true, message: "Transfer request rejected." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to reject transfer request.", error: error.message });
  }
};

// PATCH /api/transfers/:id/execute
const executeTransfer = async (req, res) => {
  try {
    const transfer = await Transfer.findOne({ _id: req.params.id, isDeleted: false });
    if (!transfer) return res.status(404).json({ success: false, message: "Transfer request not found." });

    if (transfer.status !== "approved" && transfer.status !== "in_progress") {
      return res.status(400).json({ success: false, message: `Transfer cannot be executed from status '${transfer.status}'. It must be approved first.` });
    }

    let targetBedId = req.body.destination_bed_id || transfer.destinationBedId;
    if (!targetBedId) {
      const availBed = await Bed.findOne({ wardId: transfer.destinationWardId, status: "available", isDeleted: false });
      if (!availBed) {
        return res.status(409).json({ success: false, message: "No available beds found in the destination ward to complete transfer." });
      }
      targetBedId = availBed._id;
    }

    // Free old bed
    if (transfer.sourceBedId) {
      await Bed.findByIdAndUpdate(transfer.sourceBedId, { status: "available", patientId: null });
    }

    // Occupy new bed
    await Bed.findByIdAndUpdate(targetBedId, { status: "occupied", patientId: transfer.patientId });

    // Update patient
    await Patient.findByIdAndUpdate(transfer.patientId, {
      currentWardId: transfer.destinationWardId,
      currentBedId: targetBedId
    });

    // Update active admission
    await Admission.findOneAndUpdate(
      { patientId: transfer.patientId, status: "active" },
      { wardId: transfer.destinationWardId, bedId: targetBedId }
    );

    // Update transfer
    transfer.status = "completed";
    transfer.destinationBedId = targetBedId;
    transfer.completedAt = new Date();
    await transfer.save();

    // Create notification
    await Notification.create({
      title: "Transfer Completed",
      message: `Patient transfer ${transfer.transferId} successfully completed.`,
      type: "transfer",
      relatedId: transfer._id,
      relatedType: "transfer"
    });

    res.json({ success: true, message: "Inter-ward transfer executed successfully." });
  } catch (error) {
    console.error("executeTransfer error:", error);
    res.status(500).json({ success: false, message: "Transfer execution failed.", error: error.message });
  }
};

module.exports = {
  getAllTransfers,
  getActiveTransfers,
  getTransferStats,
  getTransferById,
  createTransfer,
  approveTransfer,
  rejectTransfer,
  executeTransfer
};
