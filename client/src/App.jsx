import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css'; 
import './styles/movieGrid.css';
import { Toaster } from 'react-hot-toast';
import { createContext, useState, useEffect, useContext } from 'react';
import api from './api/api';
import Home from './pages/Home';
import SignIn from './pages/Signin';
import SignUp from './pages/Signup';
import ForgetPassword from './pages/ForgetPassword';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AdminDashboard from './pages/AdminDashboard';
import Header from './component/layout/Navbar';
import Footer from './component/layout/Footer';
import MovieDetail from './pages/MovieDetail';
import MovieList from './pages/MovieList';
import SearchResult from './pages/SearchResult';

// Auth Context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function AppContent() {
  const location = useLocation();
  const hideLayoutRoutes = ['/signin', '/signup', '/forget-password', '/privacy-policy'];
  
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      setUser({ username: res.data.username });
    } catch (error) {
      setUser(null); 
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.status === 200) {
      setUser({ username: res.data.username });
    }
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUser(null);
    }
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
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/movies" element={<MovieList />} />
          <Route path="/search" element={<SearchResult />} />
        </Routes>
      </main>
      {!hideLayoutRoutes.includes(location.pathname) && <Footer />}
    </AuthContext.Provider>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}