const { z } = require('zod');

const signupSchema = z.object({
  userType: z.enum(['NGO', 'Institute'], { required_error: "User type is required" }),
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(30, { message: "Username must be less than 30 characters" })
    .min(1, { message: "Username is required" }),
  email: z.string()
    .email({ message: "Invalid email format" })
    .min(1, { message: "Email is required" }),
  phone: z.string()
    .regex(/^\d{10}$/, { message: "Phone number must be 10 digits" })
    .min(1, { message: "Phone number is required" }),
  address: z.object({
    street: z.string().min(1, { message: "Street is required" }),
    city: z.string().min(1, { message: "City is required" }),
    state: z.string().min(1, { message: "State is required" }),
    zip: z.string().regex(/^\d+$/, { message: "Zip code must be numeric" })
      .min(1, { message: "Zip code is required" })
  }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .min(1, { message: "Password is required" })
});

// Function to validate signup data
function validateSignupData(data) {
  try {
    signupSchema.parse(data); // Parses and validates the input data
    return { success: true, errors: null };
  } catch (err) {
    return {
      success: false,
      errors: err.errors.map(error => ({
        field: error.path[0],
        message: error.message
      }))
    };
  }
}

module.exports = { validateSignupData };


// Function to validate signup data
function validateSignupData(data) {
  try {
    signupSchema.parse(data); // Parses and validates the input data
    return { success: true, errors: null };
  } catch (err) {
    return {
      success: false,
      errors: err.errors.map(error => ({
        field: error.path[0],
        message: error.message
      }))
    };
  }
}



const loginschema=z.object({
    email:z
    .string({required_error:"email is required"})
    .email({message:"invalid email"})
    .trim()
    .min(3,{message:"required min 3 letters"})
    .max(255,{message:"maximum limit is upto 255"}),
    password:z
    .string({required_error:"email is required"})
    .trim()
    .min(8,{message:"required min 3 letters"})
    .max(12,{message:"maximum limit is upto 255"})
})
module.exports = { validateSignupData };