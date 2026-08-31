const authMiddleware = (req, res, next) => {
    // Temporary user for testing
    req.user = {
        _id: "68a123456789abcdef123456"
    };

    next();
};

module.exports = authMiddleware;