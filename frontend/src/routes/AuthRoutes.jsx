import { Routes, Route } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import SignIn from "../pages/auth/SignIn/SignIn";
import SignUp from "../pages/auth/SignUp/SignUp";
import ForgotPassword from "../pages/auth/ForgotPassword/ForgotPassword";
import PersonalDetailsForm from "../pages/auth/SignUp/CreateProfile/PersonalDetailsForm";
import ProfessionalDetailsForm from "../pages/auth/SignUp/CreateProfile/ProfessionalDetailsForm";
import DocumentationDetailsForm from "../pages/auth/SignUp/CreateProfile/DocumentationDetailsForm";
import ProfileStatus from "../pages/auth/SignUp/ProfileStatus/ProfileStatus";
import PaymentScreen from "../pages/PaymentScreen/PaymentScreen";
import ResetPassword from "../pages/auth/ResetPassword/ResetPassword";
import SignUpPaymentCallback from "../pages/auth/SignUp/components/SignUpFormCallback.js";
import { Navigate } from "react-router-dom";
import React from "react";
import MembershipForm from "../pages/auth/SignUp/MembershipFrom.jsx";
const AuthRoutes = () => {
  return (
    <Routes>
      {/* Wrap all auth-related routes inside AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route path="signin" element={<Navigate to="/auth/login" />} />
        <Route path="login" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route
          path="create-profile/personal-details"
          element={<PersonalDetailsForm />}
        />
        <Route path="status" element={<ProfileStatus></ProfileStatus>} ></Route>
        <Route
          path="create-profile/professional-details"
          element={<ProfessionalDetailsForm />}
        />
        <Route
          path="create-profile/documentation-details"
          element={<DocumentationDetailsForm />}
        />
        <Route path="payment" element={<PaymentScreen />} />
        <Route path="signup/payment-callback" element={<SignUpPaymentCallback />} />
        <Route path="profile-status" element={<ProfileStatus />} />
        <Route path="/" element={<Navigate to="/auth/login" />} />
        <Route path="membership-form" element={<MembershipForm />} />

      </Route>
    </Routes>
  );
};

export default AuthRoutes;
