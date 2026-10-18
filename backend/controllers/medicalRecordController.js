const MedicalRecord = require("../models/MedicalRecord");
const Prescription = require("../models/Prescription");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

// ─── MEDICAL RECORDS ──────────────────────────────────────────────────────────

const getAllMedicalRecords = async (req, res) => {
  try {
    const { patient_id, doctor_id, date_from, date_to } = req.query;
    const filter = { isDeleted: false };
    if (patient_id) filter.patientId = patient_id;
    if (doctor_id) filter.doctorId = doctor_id;
    if (date_from || date_to) {
      filter.createdAt = {};
      if (date_from) filter.createdAt.$gte = new Date(date_from);
      if (date_to) filter.createdAt.$lte = new Date(date_to);
    }

    const records = await MedicalRecord.find(filter)
      .populate("patientId", "firstName lastName patientId")
      .populate("doctorId", "name")
      .sort({ createdAt: -1 })
      .lean();

    const mapped = records.map(mr => ({
      ...mr,
      id: mr._id,
      patient_id: mr.patientId?._id,
      patient_name: mr.patientId ? `${mr.patientId.firstName} ${mr.patientId.lastName}` : null,
      patient_code: mr.patientId?.patientId || null,
      doctor_id: mr.doctorId?._id,
      doctor_name: mr.doctorId?.name || null,
      vital_signs: mr.vitalSigns,
      follow_up_date: mr.followUpDate,
      created_at: mr.createdAt
    }));

    res.json({ success: true, message: "Medical records retrieved.", data: mapped, count: mapped.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve medical records.", error: error.message });
  }
};

const getMedicalRecordById = async (req, res) => {
  try {
    const mr = await MedicalRecord.findOne({ _id: req.params.id, isDeleted: false })
      .populate("patientId", "firstName lastName")
      .populate("doctorId", "name")
      .lean();

    if (!mr) return res.status(404).json({ success: false, message: "Medical record not found." });

    res.json({
      success: true,
      message: "Medical record retrieved.",
      data: {
        ...mr,
        id: mr._id,
        patient_name: mr.patientId ? `${mr.patientId.firstName} ${mr.patientId.lastName}` : null,
        doctor_name: mr.doctorId?.name || null,
        vital_signs: mr.vitalSigns
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve medical record.", error: error.message });
  }
};

const getPatientMedicalHistory = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.params.patientId, isDeleted: false })
      .populate("doctorId", "name")
      .sort({ createdAt: -1 })
      .lean();

    const mapped = records.map(mr => ({
      ...mr,
      id: mr._id,
      doctor_name: mr.doctorId?.name || null,
      vital_signs: mr.vitalSigns
    }));

    res.json({ success: true, message: "Patient medical history retrieved.", data: mapped, count: mapped.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve patient medical history.", error: error.message });
  }
};

const createMedicalRecord = async (req, res) => {
  try {
    const { patient_id, doctor_id, diagnosis, symptoms, notes, treatment, vital_signs, follow_up_date } = req.body;
    if (!patient_id || !diagnosis) {
      return res.status(400).json({ success: false, message: "patient_id and diagnosis are required." });
    }

    const newRec = await MedicalRecord.create({
      patientId: patient_id,
      doctorId: doctor_id || null,
      diagnosis: diagnosis.trim(),
      symptoms: symptoms || null,
      notes: notes || null,
      treatment: treatment || null,
      vitalSigns: vital_signs || null,
      followUpDate: follow_up_date ? new Date(follow_up_date) : null,
      isDeleted: false
    });

    res.status(201).json({ success: true, message: "Medical record created.", data: newRec });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create medical record.", error: error.message });
  }
};

const updateMedicalRecord = async (req, res) => {
  try {
    const { diagnosis, symptoms, notes, treatment, vital_signs, follow_up_date } = req.body;
    const updates = {};
    if (diagnosis) updates.diagnosis = diagnosis;
    if (symptoms !== undefined) updates.symptoms = symptoms;
    if (notes !== undefined) updates.notes = notes;
    if (treatment !== undefined) updates.treatment = treatment;
    if (vital_signs !== undefined) updates.vitalSigns = vital_signs;
    if (follow_up_date !== undefined) updates.followUpDate = follow_up_date ? new Date(follow_up_date) : null;

    const updated = await MedicalRecord.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, updates, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Medical record not found." });

    res.json({ success: true, message: "Medical record updated.", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update medical record.", error: error.message });
  }
};

const deleteMedicalRecord = async (req, res) => {
  try {
    const updated = await MedicalRecord.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Medical record not found." });
    res.json({ success: true, message: "Medical record deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete medical record.", error: error.message });
  }
};

// ─── PRESCRIPTIONS ────────────────────────────────────────────────────────────

const getPrescriptions = async (req, res) => {
  try {
    const { patient_id, doctor_id } = req.query;
    const filter = { isDeleted: false };
    if (patient_id) filter.patientId = patient_id;
    if (doctor_id) filter.doctorId = doctor_id;

    const prescriptions = await Prescription.find(filter)
      .populate("patientId", "firstName lastName patientId")
      .populate("doctorId", "name")
      .sort({ createdAt: -1 })
      .lean();

    const mapped = prescriptions.map(pr => ({
      ...pr,
      id: pr._id,
      patient_id: pr.patientId?._id,
      patient_name: pr.patientId ? `${pr.patientId.firstName} ${pr.patientId.lastName}` : null,
      patient_code: pr.patientId?.patientId || null,
      doctor_id: pr.doctorId?._id,
      doctor_name: pr.doctorId?.name || null,
      medicine_name: pr.medicineName
    }));

    res.json({ success: true, message: "Prescriptions retrieved.", data: mapped, count: mapped.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve prescriptions.", error: error.message });
  }
};

const getPrescriptionById = async (req, res) => {
  try {
    const pr = await Prescription.findOne({ _id: req.params.id, isDeleted: false })
      .populate("patientId", "firstName lastName")
      .populate("doctorId", "name")
      .lean();

    if (!pr) return res.status(404).json({ success: false, message: "Prescription not found." });

    res.json({
      success: true,
      message: "Prescription retrieved.",
      data: {
        ...pr,
        id: pr._id,
        patient_name: pr.patientId ? `${pr.patientId.firstName} ${pr.patientId.lastName}` : null,
        doctor_name: pr.doctorId?.name || null,
        medicine_name: pr.medicineName
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve prescription.", error: error.message });
  }
};

const createPrescription = async (req, res) => {
  try {
    const { patient_id, doctor_id, medicine_name, dosage, frequency, duration, instructions } = req.body;
    if (!patient_id || !doctor_id || !medicine_name || !dosage) {
      return res.status(400).json({ success: false, message: "patient_id, doctor_id, medicine_name, and dosage are required." });
    }

    const newPres = await Prescription.create({
      patientId: patient_id,
      doctorId: doctor_id,
      medicineName: medicine_name.trim(),
      dosage: dosage.trim(),
      frequency: frequency || null,
      duration: duration || null,
      instructions: instructions || null,
      isDeleted: false
    });

    res.status(201).json({ success: true, message: "Prescription created.", data: newPres });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create prescription.", error: error.message });
  }
};

const updatePrescription = async (req, res) => {
  try {
    const { medicine_name, dosage, frequency, duration, instructions, status } = req.body;
    const updates = {};
    if (medicine_name) updates.medicineName = medicine_name;
    if (dosage) updates.dosage = dosage;
    if (frequency !== undefined) updates.frequency = frequency;
    if (duration !== undefined) updates.duration = duration;
    if (instructions !== undefined) updates.instructions = instructions;
    if (status) updates.status = status;

    const updated = await Prescription.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, updates, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Prescription not found." });

    res.json({ success: true, message: "Prescription updated.", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update prescription.", error: error.message });
  }
};

module.exports = {
  getAllMedicalRecords,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  getPatientMedicalHistory,
  getPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription
};
