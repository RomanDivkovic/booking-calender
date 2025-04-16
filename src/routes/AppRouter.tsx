import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/Home/HomePage';
import LoginPage from '../pages/Auth/LoginPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import Layout from '../components/Layout/Layout';
import BookingsPage from '../pages/Booking/BookingPage';
import ProtectedRoute from './ProtectedRoute';
import { RegisterPage } from '../pages/Auth/RegisterPage';
import { ContactPage } from '../pages/Contact/ContactPage';
import FullCalender from '../pages/Calender/CalendarPage';
import AboutPage from '../pages/Contact/AboutPage';

export default function AppRouter() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Publik sida */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<RegisterPage />} />

          {/* Skyddade sidor */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/calendar" element={<FullCalender />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
}
