import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { lazy, Suspense } from 'react'
import ScrollToTop from './components/ScrollToTop.jsx'
import PublicLayout from './layouts/PublicLayout.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import EcoLoader from './components/EcoLoader.jsx'
import './index.css'
import PrivacyToast from './components/PrivacyToast.jsx'

import Home from './pages/Home.jsx'
// lazy load other pages
const Challenges = lazy(() => import('./pages/Challenges.jsx'))
const ChallengeDetail = lazy(() => import('./pages/ChallengeDetail.jsx'))
const Tips = lazy(() => import('./pages/Tips.jsx'))
const Events = lazy(() => import('./pages/Events.jsx'))
const EventDetail = lazy(() => import('./pages/EventDetail.jsx'))
const AddEvent = lazy(() => import('./pages/AddEvent.jsx'))
const EditEvent = lazy(() => import('./pages/EditEvent.jsx'))
const MyEvents = lazy(() => import('./pages/MyEvents.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Register = lazy(() => import('./pages/Register.jsx'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'))
const MyActivities = lazy(() => import('./pages/MyActivities.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))
const Settings = lazy(() => import('./pages/Settings.jsx'))
const AddChallenge = lazy(() => import('./pages/AddChallenge.jsx'))
const EditChallenge = lazy(() => import('./pages/EditChallenge.jsx'))
const JoinChallenge = lazy(() => import('./pages/JoinChallenge.jsx'))

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/tips" element={<Tips />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
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
              path="/challenges/add"
              element={
                <ProtectedRoute>
                  <AddChallenge />
                </ProtectedRoute>
              }
            />
            <Route
              path="/challenges/:slug/edit"
              element={
                <ProtectedRoute>
                  <EditChallenge />
                </ProtectedRoute>
              }
            />
            <Route path="/challenges/:slug" element={<ChallengeDetail />} />
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
              path="/challenges/join/:id"
              element={
                <ProtectedRoute>
                  <JoinChallenge />
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
            duration: 3000,
            style: {
              background: 'rgb(var(--color-surface))',
              color: 'rgb(var(--color-text))',
              borderRadius: 'var(--radius)',
              padding: '16px',
              border: '1px solid rgb(var(--color-border))',
            },
            success: {
              style: {
                background: 'rgb(var(--color-surface))',
                border: '1px solid rgb(var(--color-primary) / 0.2)',
                color: 'rgb(var(--color-primary))',
              },
              iconTheme: {
                primary: 'rgb(var(--color-primary))',
                secondary: 'rgb(var(--color-surface))',
              },
            },
            error: {
              style: {
                background: 'rgb(var(--color-surface))',
                border: '1px solid rgb(var(--color-danger) / 0.25)',
                color: 'rgb(var(--color-danger))',
              },
              iconTheme: {
                primary: 'rgb(var(--color-danger))',
                secondary: 'rgb(var(--color-surface))',
              },
            },
          }}
          containerStyle={{
            top: 80,
          }}
        />
        <PrivacyToast />
      </BrowserRouter>
    </AuthProvider>
  )
}
