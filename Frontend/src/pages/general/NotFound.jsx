import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#f8f9fa'
        }}>
            <h1 style={{ 
                fontSize: '120px', 
                marginBottom: '20px',
                fontWeight: 'bold',
                color: '#343a40'
            }}>
                404
            </h1>
            <h2 style={{ 
                fontSize: '32px', 
                marginBottom: '10px',
                color: '#495057'
            }}>
                Page Not Found
            </h2>
            <p style={{ 
                fontSize: '18px', 
                color: '#6c757d', 
                marginBottom: '30px',
                maxWidth: '500px'
            }}>
                Sorry, the page you are looking for does not exist or has been moved.
            </p>
            <div style={{ display: 'flex', gap: '15px' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
                >
                    Go Back
                </button>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                >
                    Go Home
                </button>
            </div>
        </div>
    );
};

export default NotFound;
