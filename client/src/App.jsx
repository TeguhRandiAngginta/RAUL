import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toaster } from 'react-hot-toast';
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Home from './pages/Home';
import SignIn from './pages/Signin';
import SignUp from './pages/Signup';
import ForgetPassword from './pages/ForgetPassword';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AdminDashboard from './pages/AdminDashboard';
import Header from './component/layout/Navbar';
import Footer from './component/layout/Footer';
import MovieDetail from './pages/MovieDetail';
import MovieList from './pages/MovieList'; // pastikan path-nya bener


// Auth Context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function AppContent() {
  const location = useLocation();
  const hideLayoutRoutes = ['/signin', '/signup', '/forget-password', '/privacy-policy'];
  
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getCookie('raul_token'); // Fungsi untuk membaca cookie
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchProfile = async (token) => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/users/profile', { withCredentials: true });
      setUser({ username: res.data.username });
    } catch (error) {
      removeCookie('raul_token'); // Hapus cookie jika token invalid
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/v1/auth/login', { email, password }, { withCredentials: true });
    if (res.status === 200) {
      setUser({ username: res.data.username });
    }
    return res.data;
  };

  const logout = () => {
    removeCookie('raul_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = { user, login, logout, isLoading };

  if (isLoading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={value}>
      <Toaster position="top-center" />
      {!hideLayoutRoutes.includes(location.pathname) && <Header />}
      <main className={hideLayoutRoutes.includes(location.pathname) ? '' : 'main-content'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/movies" element={<MovieList />} />
        </Routes>
      </main>
      {!hideLayoutRoutes.includes(location.pathname) && <Footer />}
    </AuthContext.Provider>
  );
}

// Fungsi utilitas untuk membaca cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Fungsi utilitas untuk menghapus cookie
function removeCookie(name) {
  document.cookie = `${name}=; Max-Age=0; path=/`;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}