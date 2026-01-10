import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { lazy, Suspense } from 'react'
import ScrollToTop from './components/ScrollToTop.jsx'
import PublicLayout from './layouts/PublicLayout.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ProtectedAdminRoute from './components/ProtectedAdminRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
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
const MyTips = lazy(() => import('./pages/MyTips.jsx'))
const AddChallenge = lazy(() => import('./pages/AddChallenge.jsx'))
const EditChallenge = lazy(() => import('./pages/EditChallenge.jsx'))
const JoinChallenge = lazy(() => import('./pages/JoinChallenge.jsx'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.jsx'))
const TermsOfService = lazy(() => import('./pages/TermsOfService.jsx'))
const CookiePolicy = lazy(() => import('./pages/CookiePolicy.jsx'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'))
const AdminChallenges = lazy(() => import('./pages/admin/AdminChallenges.jsx'))
const AdminEvents = lazy(() => import('./pages/admin/AdminEvents.jsx'))
const AdminTips = lazy(() => import('./pages/admin/AdminTips.jsx'))
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials.jsx'))
const AdminHowItWorks = lazy(() => import('./pages/admin/AdminHowItWorks.jsx'))
const AdminFooter = lazy(() => import('./pages/admin/AdminFooter.jsx'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers.jsx'))
const AdminActivity = lazy(() => import('./pages/admin/AdminActivity.jsx'))
const AdminReset = lazy(() => import('./pages/admin/AdminReset.jsx'))

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
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
                path="/my-events"
                element={
                  <ProtectedRoute>
                    <MyEvents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-tips"
                element={
                  <ProtectedRoute>
                    <MyTips />
                  </ProtectedRoute>
                }
              />
            </Route>

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
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/cookies" element={<CookiePolicy />} />
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
            </Route>

            <Route path="/control-panel" element={<Suspense fallback={<EcoLoader />}><AdminLogin /></Suspense>} />

            <Route
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route path="/control-panel/dashboard" element={<AdminDashboard />} />
              <Route path="/control-panel/challenges" element={<AdminChallenges />} />
              <Route path="/control-panel/events" element={<AdminEvents />} />
              <Route path="/control-panel/tips" element={<AdminTips />} />
              <Route path="/control-panel/testimonials" element={<AdminTestimonials />} />
              <Route path="/control-panel/how-it-works" element={<AdminHowItWorks />} />
              <Route path="/control-panel/footer" element={<AdminFooter />} />
              <Route path="/control-panel/users" element={<AdminUsers />} />
              <Route path="/control-panel/activity" element={<AdminActivity />} />
            </Route>
            <Route path="*" element={<NotFound />} />
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
      </ThemeProvider>
    </AuthProvider>
  )
}
