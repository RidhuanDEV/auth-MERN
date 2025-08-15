import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import SignUpPage from "./pages/SignUpPages";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  } else if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

const RedirectAuthenticatedUserToHome = ({children}) => {
  const { isAuthenticated, user } = useAuthStore();

  if(isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { user, isAuthenticated, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  console.log("isAuthenticated:", isAuthenticated);
  console.log("isCheckingAuth:", isCheckingAuth);
  console.log("user" , user)

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
        <FloatingShape
          color="bg-green-500"
          size="w-64 h-64"
          top="-5%"
          left="10%"
          delay={0}
        />
        <FloatingShape
          color="bg-emerald-500"
          size="w-48 h-48"
          top="70%"
          left="80%"
          delay={5}
        />
        <FloatingShape
          color="bg-lime-500"
          size="w-32 h-32"
          top="40%"
          left="-10%"
          delay={2}
        />

        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/signup" element={
            <RedirectAuthenticatedUserToHome>
              <SignUpPage />
            </RedirectAuthenticatedUserToHome>
          } />
          <Route path="/login" element={
            <RedirectAuthenticatedUserToHome>
              <LoginPage />
            </RedirectAuthenticatedUserToHome>
          } />
          <Route path="/forgot-password" element={
            <RedirectAuthenticatedUserToHome>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUserToHome>
          } />
          <Route path="/reset-password" element={
            <RedirectAuthenticatedUserToHome>
              <ResetPasswordPage />
            </RedirectAuthenticatedUserToHome>
          } />
          <Route path="/verify-email" element={
            <RedirectAuthenticatedUserToHome>
              <EmailVerificationPage />
            </RedirectAuthenticatedUserToHome>
          } />
          <Route path="/reset-password/:token" element={
            <RedirectAuthenticatedUserToHome>
              <ResetPasswordPage />
            </RedirectAuthenticatedUserToHome>
          } />

          {/* Catch all routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </div>
    </>
  );
}

export default App;
