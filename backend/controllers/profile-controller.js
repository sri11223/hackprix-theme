const { User, Individual, Startup, Investor } = require('../models/usermodel');

// Type-specific validation schemas
const profileValidation = {
    INDIVIDUAL: {
        required: ['profilePicture', 'age', 'gender', 'skills', 'bio'],
        number: ['age'],
        array: ['skills'],
        string: ['profilePicture', 'gender', 'bio']
    },
    STARTUP: {
        required: ['companyName', 'description', 'domains', 'stage', 'teamSize'],
        number: ['teamSize'],
        array: ['domains'],
        string: ['companyName', 'description', 'stage']
    },
    INVESTOR: {
        required: ['investorType'],
        string: ['investorType']
    }
};

const validateProfileData = (userType, data) => {
    const schema = profileValidation[userType];
    const errors = [];

    // Convert string arrays to actual arrays
    if (schema.array) {
        schema.array.forEach(field => {
            if (data[field] && typeof data[field] === 'string') {
                data[field] = data[field].split(',').map(item => item.trim());
            }
        });
    }

    // Convert string numbers to numbers
    if (schema.number) {
        schema.number.forEach(field => {
            if (data[field] && typeof data[field] === 'string') {
                data[field] = Number(data[field]);
            }
        });
    }

    // Check required fields
    schema.required.forEach(field => {
        if (!data[field] && data[field] !== 0) { // Include 0 as valid
            errors.push(`${field} is required`);
        }
    });

    // Validate field types
    if (schema.number) {
        schema.number.forEach(field => {
            if (data[field] && isNaN(data[field])) {
                errors.push(`${field} must be a number`);
            }
        });
    }

    if (schema.array) {
        schema.array.forEach(field => {
            if (data[field] && !Array.isArray(data[field])) {
                errors.push(`${field} must be an array`);
            }
        });
    }

    return errors;
};

exports.completeProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log('Debug - User ID from token:', userId);
        const { userType, ...profileData } = req.body;
        console.log('Debug - Request body:', { userType, ...profileData });

        // Validate user type
        if (!['INDIVIDUAL', 'STARTUP', 'INVESTOR'].includes(userType)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid user type' 
            });
        }

        // Validate profile data
        const validationErrors = validateProfileData(userType, profileData);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        // Get the appropriate model based on user type
        let UserModel;
        switch (userType) {
            case 'INDIVIDUAL':
                UserModel = Individual;
                break;
            case 'STARTUP':
                UserModel = Startup;
                break;
            case 'INVESTOR':
                UserModel = Investor;
                break;
        }

        // Check if user exists
        let existingUser;
        try {
            // First check if user exists
            existingUser = await User.findById(userId);
            console.log('Debug - Found user:', existingUser);

            if (!existingUser) {
                console.log('Debug - User not found in database');
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                    debug: { userId, userType, profileData }
                });
            }

            if (existingUser.profileCompleted) {
                return res.status(400).json({
                    success: false,
                    message: 'Profile already completed'
                });
            }

            // Then update the base User model first to set the userType
            await User.findByIdAndUpdate(
                userId,
                { userType },
                { new: true, runValidators: true }
            );

            // Now update the specific model (Individual, Startup, or Investor)
            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                { 
                    ...profileData,
                    profileCompleted: true 
                },
                { 
                    new: true,
                    runValidators: true 
                }
            );

            // Update user with type-specific data
           

            return res.status(200).json({
                success: true,
                message: 'Profile completed successfully',
                data: {
                    userType: updatedUser.userType,
                    profileCompleted: updatedUser.profileCompleted
                }
            });

        } catch (error) {
            console.error('Debug - Error updating profile:', error);
            return res.status(500).json({
                success: false,
                message: 'Error updating profile',
                debug: {
                    error: error.message,
                    userId,
                    userType
                }
            });
        }
    } catch (error) {
        console.error('Profile completion error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to complete profile',
            error: error.message
        });
    }
};
