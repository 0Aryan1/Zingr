import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const PublicRoute = ({ children }) => {
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
                const response = await axios.get('http://localhost:3000/api/auth/check', {
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
            } catch (error) {
                console.error('Auth check error:', error);
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

    // If authenticated, redirect to appropriate home page
    if (authState.isAuthenticated) {
        if (authState.userType === 'user') {
            return <Navigate to="/" replace />;
        } else if (authState.userType === 'foodPartner') {
            return <Navigate to={`/food-partner/${authState.userId}`} replace />;
        }
    }

    // Not authenticated - allow access to auth pages
    return children;
};

export default PublicRoute;
