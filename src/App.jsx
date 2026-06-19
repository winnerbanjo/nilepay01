import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NilePayProvider } from './context/NilePayContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

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

export default function App() {
  return (
    <NilePayProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-nile-bg text-nile-dark selection:bg-nile-brightgreen/40">
          {/* Header Navigation */}
          <Navbar />

          {/* Main App Routes */}
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

              {/* Compliance Admin Routes */}
              <Route path="/admin/compliance" element={<ComplianceDashboard />} />
              <Route path="/admin/compliance/applications/:id" element={<ComplianceReviewPage />} />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer Branding */}
          <Footer />
        </div>
      </Router>
    </NilePayProvider>
  );
}
