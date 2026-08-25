import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import ProtectedRoute from '@/components/ProtectedRoute'
import PublicRoute from '@/components/PublicRoute'
import Splash from '@/components/feedback/Splash'
import { AuthProvider } from '@/context/AuthContext'
import AppShell from '@/layouts/AppShell'
import PartnerShell from '@/layouts/PartnerShell'

// Route-level code splitting. The partner surface is further isolated into
// its own chunk by the manualChunks rule in vite.config.js.
const ChooseRegister = lazy(() => import('@/pages/auth/ChooseRegister'))
const UserLogin = lazy(() => import('@/pages/auth/UserLogin'))
const UserRegister = lazy(() => import('@/pages/auth/UserRegister'))
const FoodPartnerLogin = lazy(() => import('@/pages/auth/FoodPartnerLogin'))
const FoodPartnerRegister = lazy(() => import('@/pages/auth/FoodPartnerRegister'))

const Home = lazy(() => import('@/pages/general/Home'))
const Discover = lazy(() => import('@/pages/general/Discover'))
const Saved = lazy(() => import('@/pages/general/Saved'))
const NotFound = lazy(() => import('@/pages/general/NotFound'))

const UserPartnerProfile = lazy(() => import('@/pages/food-partner/User-PartnerProfile'))
const PartnerProfile = lazy(() => import('@/pages/food-partner/PartnerProfile'))
const CreateFood = lazy(() => import('@/pages/food-partner/CreateFood'))

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<Splash />}>
          <Routes>
            {/* Public routes - Auth pages (redirect if already logged in) */}
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <ChooseRegister />
                </PublicRoute>
              }
            />
            <Route
              path="/user/register"
              element={
                <PublicRoute>
                  <UserRegister />
                </PublicRoute>
              }
            />
            <Route
              path="/user/login"
              element={
                <PublicRoute>
                  <UserLogin />
                </PublicRoute>
              }
            />
            <Route
              path="/food-partner/register"
              element={
                <PublicRoute>
                  <FoodPartnerRegister />
                </PublicRoute>
              }
            />
            <Route
              path="/food-partner/login"
              element={
                <PublicRoute>
                  <FoodPartnerLogin />
                </PublicRoute>
              }
            />

            {/* Protected routes - User only. The shell owns nav + surface. */}
            <Route
              element={
                <ProtectedRoute requiredRole="user">
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Home />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/user-partner-profile/:id" element={<UserPartnerProfile />} />
            </Route>

            {/* Protected routes - Food Partner only */}
            <Route
              element={
                <ProtectedRoute requiredRole="foodPartner">
                  <PartnerShell />
                </ProtectedRoute>
              }
            >
              <Route path="/create-food" element={<CreateFood />} />
              <Route path="/food-partner/:id" element={<PartnerProfile />} />
            </Route>

            {/* 404 - Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  )
}

export default AppRoutes
