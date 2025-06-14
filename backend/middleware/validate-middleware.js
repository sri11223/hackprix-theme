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

module.exports = { validate };
