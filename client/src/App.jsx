import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import CSS Bootstrap
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import SignIn from './pages/Signin';
import SignUp from './pages/Signup';
import ForgetPassword from './pages/ForgetPassword';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AdminDashboard from './pages/AdminDashboard';
import Header from './component/Navbar';
import Footer from './component/Footer';

function AppContent() {
  const location = useLocation();
  
  // routes tanpa header & footer
  const hideLayoutRoutes = ['/signin', '/signup', '/forget-password', '/privacy-policy'];

  return (
    <>
      <Toaster position="top-center" />

      {/* Header */}
      {!hideLayoutRoutes.includes(location.pathname) && <Header />}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>

      {/* Footer */}
      {!hideLayoutRoutes.includes(location.pathname) && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
