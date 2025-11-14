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
import EventDetail from './pages/EventDetail.jsx'
import AddEvent from './pages/AddEvent.jsx'
import EditEvent from './pages/EditEvent.jsx'
import MyEvents from './pages/MyEvents.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import MyActivities from './pages/MyActivities.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import AddChallenge from './pages/AddChallenge.jsx'
import EditChallenge from './pages/EditChallenge.jsx'
import JoinChallenge from './pages/JoinChallenge.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'
import PrivacyToast from './components/PrivacyToast.jsx'

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
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<NotFound />} />
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
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
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
              path="/challenges/edit/:id"
              element={
                <ProtectedRoute>
                  <EditChallenge />
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
            <Route
              path="/events/add"
              element={
                <ProtectedRoute>
                  <AddEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id/edit"
              element={
                <ProtectedRoute>
                  <EditEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/my-events"
              element={
                <ProtectedRoute>
                  <MyEvents />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 1000,
            style: {
              background: '#022c22',
              color: '#ecfdf5',
              borderRadius: '9999px',
              padding: '12px 20px',
              boxShadow:
                '0 20px 25px -5px rgba(6, 78, 59, 0.4), 0 10px 10px -5px rgba(6, 78, 59, 0.3)',
            },
            // Ensure only the built-in left icon appears; no extra right icons
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#022c22',
              },
            },
            error: {
              iconTheme: {
                primary: '#f97373',
                secondary: '#022c22',
              },
            },
          }}
          containerStyle={{
            top: 16,
          }}
        />
        <PrivacyToast />
      </BrowserRouter>
    </AuthProvider>
  )
}
