import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';

const ProtectedRoute = ({ children, requiredRole }) => {
    const [authState, setAuthState] = useState({
        isAuthenticated: null,
        userType: null,
        userId: null,
        loading: true
    });
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/auth/check`, {
                    withCredentials: true
                });

                if (response.data.authenticated) {
                    setAuthState({
                        isAuthenticated: true,
                        userType: response.data.userType,
                        userId: response.data.userId,
                        loading: false
                    });
                } else {
                    setAuthState({
                        isAuthenticated: false,
                        userType: null,
                        userId: null,
                        loading: false
                    });
                }
            } catch {
                setAuthState({
                    isAuthenticated: false,
                    userType: null,
                    userId: null,
                    loading: false
                });
            }
        };

        checkAuth();
    }, [location.pathname]);

    // Show loading state
    if (authState.loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px',
                color: '#666'
            }}>
                Loading...
            </div>
        );
    }

    // Not authenticated - redirect to login
    if (!authState.isAuthenticated) {
        return <Navigate to="/user/login" state={{ from: location }} replace />;
    }

    // Check role-based access
    if (requiredRole) {
        // If route requires 'user' but logged in as 'foodPartner'
        if (requiredRole === 'user' && authState.userType === 'foodPartner') {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>403</h1>
                    <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Access Denied</h2>
                    <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
                        You don't have permission to access this page as a food partner.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        style={{
                            padding: '12px 24px',
                            fontSize: '16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        Go Back
                    </button>
                </div>
            );
        }

        // If route requires 'foodPartner' but logged in as 'user'
        if (requiredRole === 'foodPartner' && authState.userType === 'user') {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>403</h1>
                    <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Access Denied</h2>
                    <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
                        You don't have permission to access this page. This is for food partners only.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        style={{
                            padding: '12px 24px',
                            fontSize: '16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        Go Back
                    </button>
                </div>
            );
        }
    }

    // Authenticated and authorized
    return children;
};

export default ProtectedRoute;
