// Simple in-memory blacklist for logged-out tokens
const blacklistedTokens = new Set();
const tokenExpiry = new Map();

// Token expiry time (7 days in milliseconds)
const TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;

function blacklistToken(token) {
    if (!token) return;
    
    blacklistedTokens.add(token);
    tokenExpiry.set(token, Date.now() + TOKEN_EXPIRY);
    
    // Auto-cleanup after expiry
    setTimeout(() => {
        blacklistedTokens.delete(token);
        tokenExpiry.delete(token);
    }, TOKEN_EXPIRY);
}

function isTokenBlacklisted(token) {
    if (!token) return false;
    
    // Clean up expired tokens
    const now = Date.now();
    for (const [tk, expiry] of tokenExpiry.entries()) {
        if (now > expiry) {
            blacklistedTokens.delete(tk);
            tokenExpiry.delete(tk);
        }
    }
    
    return blacklistedTokens.has(token);
}

module.exports = {
    blacklistToken,
    isTokenBlacklisted
};
