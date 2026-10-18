const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Department = require("../models/Department");

const generateAppointmentId = () => `APT-${Math.floor(1000 + Math.random() * 9000)}`;

// GET /api/appointments
const getAllAppointments = async (req, res) => {
  try {
    const { patient_id, doctor_id, department_id, date, status, search } = req.query;
    const filter = { isDeleted: false };
    if (patient_id) filter.patientId = patient_id;
    if (doctor_id) filter.doctorId = doctor_id;
    if (department_id) filter.departmentId = department_id;
    if (status) filter.status = status;
    if (date) {
      const d = new Date(date);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.appointmentDate = { $gte: d, $lt: nextDay };
    }

    let appointments = await Appointment.find(filter)
      .populate("patientId", "firstName lastName patientId")
      .populate("doctorId", "name specialization")
      .populate("departmentId", "name")
      .sort({ appointmentDate: -1, appointmentTime: 1 })
      .lean();

    if (search) {
      const regex = new RegExp(search, "i");
      appointments = appointments.filter(a =>
        regex.test(a.patientId?.firstName) ||
        regex.test(a.patientId?.lastName) ||
        regex.test(a.doctorId?.name)
      );
    }

    const mapped = appointments.map(a => ({
      ...a,
      id: a._id,
      appointment_id: a.appointmentId,
      patient_id: a.patientId?._id,
      patient_name: a.patientId ? `${a.patientId.firstName} ${a.patientId.lastName}` : null,
      patient_code: a.patientId?.patientId || null,
      doctor_id: a.doctorId?._id,
      doctor_name: a.doctorId?.name || null,
      specialization: a.doctorId?.specialization || null,
      department_name: a.departmentId?.name || null,
      appointment_date: a.appointmentDate,
      appointment_time: a.appointmentTime
    }));

    res.json({ success: true, message: "Appointments retrieved.", data: mapped, count: mapped.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve appointments.", error: error.message });
  }
};

// GET /api/appointments/today
const getTodaysAppointments = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await Appointment.find({
      isDeleted: false,
      appointmentDate: { $gte: today, $lt: tomorrow }
    })
      .populate("patientId", "firstName lastName")
      .populate("doctorId", "name")
      .sort({ appointmentTime: 1 })
      .lean();

    const mapped = appointments.map(a => ({
      ...a,
      id: a._id,
      appointment_id: a.appointmentId,
      patient_name: a.patientId ? `${a.patientId.firstName} ${a.patientId.lastName}` : null,
      doctor_name: a.doctorId?.name || null
    }));

    res.json({ success: true, message: "Today's appointments retrieved.", data: mapped });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve today's appointments.", error: error.message });
  }
};

// GET /api/appointments/:id
const getAppointmentById = async (req, res) => {
  try {
    const a = await Appointment.findOne({ _id: req.params.id, isDeleted: false })
      .populate("patientId", "firstName lastName")
      .populate("doctorId", "name")
      .populate("departmentId", "name")
      .lean();

    if (!a) return res.status(404).json({ success: false, message: "Appointment not found." });

    res.json({
      success: true,
      message: "Appointment retrieved.",
      data: {
        ...a,
        id: a._id,
        appointment_id: a.appointmentId,
        patient_name: a.patientId ? `${a.patientId.firstName} ${a.patientId.lastName}` : null,
        doctor_name: a.doctorId?.name || null,
        department_name: a.departmentId?.name || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve appointment.", error: error.message });
  }
};

// POST /api/appointments
const createAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, department_id, appointment_date, appointment_time, reason, notes } = req.body;
    if (!patient_id || !doctor_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ success: false, message: "patient_id, doctor_id, appointment_date, and appointment_time are required." });
    }

    const newApt = await Appointment.create({
      appointmentId: generateAppointmentId(),
      patientId: patient_id,
      doctorId: doctor_id,
      departmentId: department_id || null,
      appointmentDate: new Date(appointment_date),
      appointmentTime: appointment_time,
      reason: reason || null,
      notes: notes || null,
      status: "scheduled",
      isDeleted: false
    });

    res.status(201).json({ success: true, message: "Appointment created.", data: newApt });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create appointment.", error: error.message });
  }
};

// PUT /api/appointments/:id
const updateAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, department_id, appointment_date, appointment_time, reason, notes, status } = req.body;
    const updates = {};
    if (patient_id) updates.patientId = patient_id;
    if (doctor_id) updates.doctorId = doctor_id;
    if (department_id !== undefined) updates.departmentId = department_id;
    if (appointment_date) updates.appointmentDate = new Date(appointment_date);
    if (appointment_time) updates.appointmentTime = appointment_time;
    if (reason !== undefined) updates.reason = reason;
    if (notes !== undefined) updates.notes = notes;
    if (status) updates.status = status;

    const updated = await Appointment.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, updates, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Appointment not found." });

    res.json({ success: true, message: "Appointment updated.", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update appointment.", error: error.message });
  }
};

// PATCH /api/appointments/:id/status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ["scheduled", "confirmed", "completed", "cancelled", "pending"];
    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be: ${valid.join(", ")}` });
    }

    const updated = await Appointment.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { status }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Appointment not found." });

    res.json({ success: true, message: `Appointment status updated to '${status}'.`, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update appointment status.", error: error.message });
  }
};

// DELETE /api/appointments/:id
const deleteAppointment = async (req, res) => {
  try {
    const updated = await Appointment.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: true, status: "cancelled" },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "Appointment not found." });
    res.json({ success: true, message: "Appointment cancelled." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to cancel appointment.", error: error.message });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getTodaysAppointments,
  updateAppointmentStatus
};
