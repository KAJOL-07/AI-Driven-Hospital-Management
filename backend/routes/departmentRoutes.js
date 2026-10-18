const express = require("express");
const router = express.Router();
const { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment } = require("../controllers/departmentController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.use(requireAuth);
router.get("/", getAllDepartments);
router.get("/:id", getDepartmentById);
router.post("/", requireRole("admin"), createDepartment);
router.put("/:id", requireRole("admin"), updateDepartment);
router.delete("/:id", requireRole("admin"), deleteDepartment);

module.exports = router;
