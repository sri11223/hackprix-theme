const validate = (schema) => async (req, res, next) => {
    try {
        const parsebody = await schema.parseAsync(req.body); // Validate the request body
        req.body = parsebody; // Update the request body with validated data
        next(); // Pass control to the next middleware
    } catch (err) {
        const status = 424;
        const message = "fill input properly";
        
        // Check if err.errors exists and has elements
        let extradetails = "Validation error occurred.";
        if (err.errors && err.errors.length > 0) {
            extradetails = err.errors[0].message; // Extract the first error message
        }
        
        const error = {
            status,
            message,
            extradetails
        };
        
        next(error); // Pass the error to the error-handling middleware
    }
}

const validateRegistration = (req, res, next) => {
    const { firstName, lastName, email, password, phone, userType, username } = req.body;

    if (!firstName || !lastName || !email || !password || !phone || !userType || !username) {
        return res.status(400).json({ msg: "All fields are required" });
    }

    if (password.length < 6) {
        return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }

    if (!email.includes('@')) {
        return res.status(400).json({ msg: "Invalid email format" });
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: "Email and password are required" });
    }

    next();
};

const validateEmail = (req, res, next) => {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
        return res.status(400).json({ msg: "Valid email is required" });
    }

    next();
};

const validateResetPassword = (req, res, next) => {
    const { password } = req.body;

    if (!password || password.length < 6) {
        return res.status(400).json({ msg: "New password must be at least 6 characters" });
    }

    next();
};

const validateProfileUpdate = (req, res, next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['firstName', 'lastName', 'phone', 'username'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ msg: "Invalid updates" });
    }

    next();
};

module.exports = {
    validate,
    validateRegistration,
    validateLogin,
    validateEmail,
    validateResetPassword,
    validateProfileUpdate
};
