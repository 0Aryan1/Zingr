import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserRegister from '../pages/auth/UserRegister';
import ChooseRegister from '../pages/auth/ChooseRegister';
import UserLogin from '../pages/auth/UserLogin';
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister';
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin';
import Home from '../pages/general/Home';
import Saved from '../pages/general/Saved';
import BottomNav from '../components/BottomNav';
import CreateFood from '../pages/food-partner/CreateFood';
import PartnerProfile from '../pages/food-partner/PartnerProfile';
import UserPartnerProfile from '../pages/food-partner/User-PartnerProfile';
import PartnerBottomNav from '../components/PartnerBottomNav';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';
import NotFound from '../pages/general/NotFound';

const AppRoutes = () => {
    return (
        <Router>
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

                {/* Protected routes - User only */}
                <Route 
                    path="/" 
                    element={
                        <ProtectedRoute requiredRole="user">
                            <Home />
                            <BottomNav />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/saved" 
                    element={
                        <ProtectedRoute requiredRole="user">
                            <Saved />
                            <BottomNav />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/user-partner-profile/:id" 
                    element={
                        <ProtectedRoute requiredRole="user">
                            <UserPartnerProfile />
                            <BottomNav />
                        </ProtectedRoute>
                    } 
                />

                {/* Protected routes - Food Partner only */}
                <Route 
                    path="/create-food" 
                    element={
                        <ProtectedRoute requiredRole="foodPartner">
                            <CreateFood />
                            <PartnerBottomNav />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/food-partner/:id" 
                    element={
                        <ProtectedRoute requiredRole="foodPartner">
                            <PartnerProfile />
                            <PartnerBottomNav />
                        </ProtectedRoute>
                    } 
                />

                {/* 404 - Catch all route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes