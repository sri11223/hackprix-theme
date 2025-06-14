const errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "backend error";
    let errordetails = "error from backend";

    // Check if err.errors exists and has elements
    if (err.errors && err.errors.length > 0) {
        errordetails = err.errors[0].message; // Access the first error message
    }

    // Log the error details
    console.error("Error occurred:", JSON.stringify({ message, errordetails, status }, null, 2));

    return res.status(status).json({ message, errordetails });
};

module.exports = errorMiddleware;
