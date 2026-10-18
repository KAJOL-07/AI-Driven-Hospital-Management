import React from "react";
import { HospitalProvider, useHospital } from "./context/HospitalContext";
import TopNavbar from "./components/layout/TopNavbar";
import Sidebar from "./components/layout/Sidebar";
import ToastContainer from "./components/layout/ToastContainer";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import SmartAllocation from "./pages/SmartAllocation";
import CapacityForecasting from "./pages/CapacityForecasting";
import BedManagement from "./pages/BedManagement";
import FloorManagement from "./pages/FloorManagement";
import PatientManagement from "./pages/PatientManagement";
import PatientRegistration from "./pages/PatientRegistration";
import BedRequests from "./pages/BedRequests";
import WardManagement from "./pages/WardManagement";
import InterWardTransfer from "./pages/InterWardTransfer";
import ReportsAnalytics from "./pages/ReportsAnalytics";
import NotificationsCenter from "./pages/NotificationsCenter";
import SettingsProfile from "./pages/SettingsProfile";
import DoctorManagement from "./pages/DoctorManagement";
import StaffManagement from "./pages/StaffManagement";
import EmergencyManagement from "./pages/EmergencyManagement";
import AppointmentManagement from "./pages/AppointmentManagement";
import MedicalRecords from "./pages/MedicalRecords";
import Pharmacy from "./pages/Pharmacy";
import LaboratoryTests from "./pages/LaboratoryTests";
import Billing from "./pages/Billing";
import Prescriptions from "./pages/Prescriptions";

import SmartAllocateModal from "./components/modals/SmartAllocateModal";
import AdmitPatientModal from "./components/modals/AdmitPatientModal";
import BedDetailsModal from "./components/modals/BedDetailsModal";
import TransferRequestModal from "./components/modals/TransferRequestModal";
import StaffProfileModal from "./components/modals/StaffProfileModal";

import "./styles/main.css";


const MainContent = () => {
  const { isAuthenticated, authView, currentPage } = useHospital();

  // If user is not authenticated, show Login or Signup
  if (!isAuthenticated) {
    return (
      <>
        {authView === "signup" ? <Signup /> : <Login />}
        <ToastContainer />
      </>
    );
  }

  // Role-based main page router
  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "smart-allocation":
      case "bed-allocation":
        return <SmartAllocation />;
      case "capacity-forecasting":
        return <CapacityForecasting />;
      case "bed-management":
        return <BedManagement />;
      case "floor-management":
      case "floor-bed-management":
        return <FloorManagement />;
      case "patient-management":
        return <PatientManagement />;
      case "patient-registration":
        return <PatientRegistration />;
      case "doctor-management":
        return <DoctorManagement />;
      case "nurse-management":
      case "staff-management":
        return <StaffManagement />;
      case "emergency-management":
        return <EmergencyManagement />;
      case "appointments":
        return <AppointmentManagement />;
      case "medical-records":
        return <MedicalRecords />;
      case "ward-management":
      case "department-management":
        return <WardManagement />;
      case "inventory":
      case "pharmacy":
        return <Pharmacy />;
      case "laboratory":
        return <LaboratoryTests />;
      case "billing":
        return <Billing />;
      case "prescriptions":
        return <Prescriptions />;
      case "bed-requests":
        return <BedRequests />;
      case "inter-ward-transfer":
        return <InterWardTransfer />;


      case "reports":
        return <ReportsAnalytics />;
      case "notifications":
        return <NotificationsCenter />;
      case "profile":
      case "settings":
        return <SettingsProfile />;
      default:
        return <Dashboard />;
    }
  };


  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <TopNavbar />
        <main className="page-content">{renderPage()}</main>
      </div>

      {/* Global Modals */}
      <SmartAllocateModal />
      <AdmitPatientModal />
      <BedDetailsModal />
      <TransferRequestModal />
      <StaffProfileModal />

      {/* Toast Feedback */}

      <ToastContainer />
    </div>
  );
};

function App() {
  return (
    <HospitalProvider>
      <MainContent />
    </HospitalProvider>
  );
}

export default App;