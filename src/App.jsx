import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ScrollToTop from './components/ScrollToTop.jsx'
import PublicLayout from './layouts/PublicLayout.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import Home from './pages/Home.jsx'
import Challenges from './pages/Challenges.jsx'
import ChallengeDetail from './pages/ChallengeDetail.jsx'
import Tips from './pages/Tips.jsx'
import Events from './pages/Events.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import MyActivities from './pages/MyActivities.jsx'
import Profile from './pages/Profile.jsx'
import AddChallenge from './pages/AddChallenge.jsx'
import JoinChallenge from './pages/JoinChallenge.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/challenges/:id" element={<ChallengeDetail />} />
            <Route path="/tips" element={<Tips />} />
            <Route path="/events" element={<Events />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>
          <Route element={<DashboardLayout />}>
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
            <Route
              path="/my-activities"
              element={
                <ProtectedRoute>
                  <MyActivities />
                </ProtectedRoute>
              }
            />
            <Route
              path="/challenges/add"
              element={
                <ProtectedRoute>
                  <AddChallenge />
                </ProtectedRoute>
              }
            />
            <Route
              path="/challenges/join/:id"
              element={
                <ProtectedRoute>
                  <JoinChallenge />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  )
}
