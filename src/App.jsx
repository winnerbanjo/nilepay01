import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { NilePayProvider } from './context/NilePayContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ComplianceHeader from './components/ComplianceHeader';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MerchantDashboard from './pages/MerchantDashboard';
import AccountTypeSelection from './pages/AccountTypeSelection';
import IndividualKycForm from './pages/IndividualKycForm';
import CorporateKycForm from './pages/CorporateKycForm';
import KycReviewPage from './pages/KycReviewPage';
import SubmittedSuccess from './pages/SubmittedSuccess';
import ComplianceDashboard from './pages/ComplianceDashboard';
import ComplianceReviewPage from './pages/ComplianceReviewPage';
import ComplianceLoginPage from './pages/ComplianceLoginPage';

function AppShell() {
  const location = useLocation();
  const isComplianceArea = location.pathname.startsWith('/admin/compliance');
  const isComplianceLogin = location.pathname === '/internal/compliance/login';

  if (isComplianceLogin) {
    return <ComplianceLoginPage />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-nile-bg text-nile-dark selection:bg-nile-brightgreen/40">
      {isComplianceArea ? <ComplianceHeader /> : <Navbar />}

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Merchant Onboarding & KYC Routes */}
          <Route path="/dashboard" element={<MerchantDashboard />} />
          <Route path="/account-type" element={<AccountTypeSelection />} />
          <Route path="/kyc/individual" element={<IndividualKycForm />} />
          <Route path="/kyc/corporate" element={<CorporateKycForm />} />
          <Route path="/kyc/review" element={<KycReviewPage />} />
          <Route path="/kyc/submitted" element={<SubmittedSuccess />} />

          {/* Restricted Compliance Routes */}
          <Route
            path="/admin/compliance"
            element={(
              <ProtectedRoute role="admin" loginPath="/internal/compliance/login">
                <ComplianceDashboard />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/admin/compliance/applications/:id"
            element={(
              <ProtectedRoute role="admin" loginPath="/internal/compliance/login">
                <ComplianceReviewPage />
              </ProtectedRoute>
            )}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isComplianceArea && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <NilePayProvider>
      <Router>
        <AppShell />
      </Router>
    </NilePayProvider>
  );
}
