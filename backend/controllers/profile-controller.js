const { User, Individual, Startup, Investor } = require('../models/usermodel');

// Type-specific validation schemas
const profileValidation = {
    INDIVIDUAL: {
        required: ['age', 'gender', 'bio'],  // Made profile picture optional
        number: ['age'],
        array: ['skills', 'interests'],  // Added interests array
        string: ['profilePicture', 'gender', 'bio', 'resumeUrl', 'lookingFor'],
        object: ['experience', 'education'],  // Added education and experience objects
    },
    STARTUP: {
        required: ['companyName', 'description', 'stage', 'teamSize'],
        number: ['teamSize'],
        array: ['domains'],
        string: ['companyName', 'description', 'stage'],
        object: ['verification', 'funding'],  // Added funding object for financial details
    },
    INVESTOR: {
        required: ['investorType'],
        string: ['investorType'],
        object: ['preferences', 'verification', 'workExperience'],
        array: ['portfolio'],
        number: ['totalInvestmentCapacity', 'availableCapacity'],
        // Making preferences structure clear in validation
        preferences: {
            sectors: { type: 'array', required: false },
            stages: { type: 'array', required: false },
            ticketSize: { type: 'object', required: false },
            geographicPreference: { type: 'array', required: false },
            riskTolerance: { type: 'string', required: false }
        }
    }
};

// Validation helper
const validateProfileData = (userType, data) => {
    const schema = profileValidation[userType];
    const errors = [];

    // Handle string to array conversion
    if (schema.array) {
        schema.array.forEach(field => {
            if (data[field] && typeof data[field] === 'string') {
                data[field] = data[field].split(',').map(item => item.trim());
            }
        });
    }

    // Handle string to number conversion
    if (schema.number) {
        schema.number.forEach(field => {
            if (data[field] && typeof data[field] === 'string') {
                data[field] = Number(data[field]);
            }
        });
    }

    // Required fields validation
    schema.required.forEach(field => {
        if (!data[field] && data[field] !== 0) {
            errors.push(`${field} is required`);
        }
    });

    // Type validations
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

    if (schema.string) {
        schema.string.forEach(field => {
            if (data[field] && typeof data[field] !== 'string') {
                errors.push(`${field} must be a string`);
            }
        });
    }

    if (schema.object) {
        schema.object.forEach(field => {
            if (data[field] && typeof data[field] !== 'object') {
                errors.push(`${field} must be an object`);
            }
        });
    }

    // Specific validations for user types
    switch (userType) {
        case 'INDIVIDUAL':
            if (data.gender && !['MALE', 'FEMALE', 'OTHER'].includes(data.gender)) {
                errors.push('gender must be one of: MALE, FEMALE, OTHER');
            }
            if (data.age && (data.age < 18 || data.age > 120)) {
                errors.push('age must be between 18 and 120');
            }
            if (data.lookingFor && !['JOB', 'COLLABORATION', 'NETWORKING', 'INVESTMENT_OPPORTUNITY'].includes(data.lookingFor)) {
                errors.push('lookingFor must be one of: JOB, COLLABORATION, NETWORKING, INVESTMENT_OPPORTUNITY');
            }
            break;
            
        case 'STARTUP':
            if (data.stage && !['IDEA', 'PROTOTYPE', 'MVP', 'EARLY_REVENUE', 'GROWTH'].includes(data.stage)) {
                errors.push('stage must be one of: IDEA, PROTOTYPE, MVP, EARLY_REVENUE, GROWTH');
            }
            if (data.teamSize && data.teamSize < 1) {
                errors.push('teamSize must be at least 1');
            }
            break;
            
        case 'INVESTOR':
            // Special validation for investor preferences
            if (data.preferences) {
                const prefsSchema = schema.preferences;
                Object.entries(prefsSchema).forEach(([field, rules]) => {
                    if (data.preferences[field]) {
                        switch (rules.type) {
                            case 'array':
                                if (!Array.isArray(data.preferences[field])) {
                                    errors.push(`preferences.${field} must be an array`);
                                }
                                break;
                            case 'object':
                                if (typeof data.preferences[field] !== 'object') {
                                    errors.push(`preferences.${field} must be an object`);
                                }
                                break;
                            case 'string':
                                if (typeof data.preferences[field] !== 'string') {
                                    errors.push(`preferences.${field} must be a string`);
                                }
                                if (field === 'riskTolerance' && !['LOW', 'MEDIUM', 'HIGH'].includes(data.preferences[field])) {
                                    errors.push(`preferences.riskTolerance must be one of: LOW, MEDIUM, HIGH`);
                                }
                                break;
                        }
                    }
                });
            }
            break;
    }

    return errors;
};

exports.completeProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log('Debug - Starting profile completion for user:', userId);
        const { userType, ...profileData } = req.body;

        console.log('Debug - Profile data received:', { userType, ...profileData });

        // Validate user type
        if (!['INDIVIDUAL', 'STARTUP', 'INVESTOR'].includes(userType)) {
            console.log('Debug - Invalid user type:', userType);
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid user type',
                validTypes: ['INDIVIDUAL', 'STARTUP', 'INVESTOR']
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
        console.log('Debug - Selected model:', UserModel.modelName);

        // Process type-specific data transformations
        switch(userType) {
            case 'INDIVIDUAL':
                if (profileData.skills && typeof profileData.skills === 'string') {
                    profileData.skills = profileData.skills.split(',').map(s => s.trim());
                }
                if (profileData.interests && typeof profileData.interests === 'string') {
                    profileData.interests = profileData.interests.split(',').map(i => i.trim());
                }
                // Initialize empty arrays if not provided
                profileData.experience = profileData.experience || [];
                profileData.education = profileData.education || [];
                break;

            case 'STARTUP':
                if (profileData.domains && typeof profileData.domains === 'string') {
                    profileData.domains = profileData.domains.split(',').map(d => d.trim());
                }
                // Initialize verification and funding objects
                profileData.verification = profileData.verification || {
                    documents: {},
                    status: 'PENDING'
                };
                profileData.funding = profileData.funding || {
                    totalRaised: 0,
                    currentlyRaising: false
                };
                break;

            case 'INVESTOR':
                // Setup preferences with proper defaults
                profileData.preferences = profileData.preferences || {};
                if (profileData.preferences.sectors && typeof profileData.preferences.sectors === 'string') {
                    profileData.preferences.sectors = profileData.preferences.sectors.split(',').map(s => s.trim());
                }
                if (profileData.preferences.stages && typeof profileData.preferences.stages === 'string') {
                    profileData.preferences.stages = profileData.preferences.stages.split(',').map(s => s.trim());
                }
                profileData.portfolio = profileData.portfolio || [];
                break;
        }

        // Validate profile data
        const validationErrors = validateProfileData(userType, profileData);
        if (validationErrors.length > 0) {
            console.log('Debug - Validation errors:', validationErrors);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        // Check if user exists and profile isn't already completed
        const existingUser = await User.findById(userId).select('+password');
        console.log('Debug - Found existing user:', existingUser ? 'Yes' : 'No');

        if (!existingUser) {
            console.log('Debug - User not found in database');
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (existingUser.profileCompleted) {
            console.log('Debug - Profile already completed for user:', userId);
            return res.status(400).json({
                success: false,
                message: 'Profile already completed'
            });
        }

        // Start a session for atomic operations
        const session = await User.startSession();
        session.startTransaction();
        console.log('Debug - Started MongoDB session');

        try {
            // First update the base user with userType
            const baseUser = await User.findById(userId).session(session);
            if (!baseUser) {
                throw new Error('User not found during transaction');
            }
            console.log('Debug - Retrieved base user in transaction');

            // Set the userType and mark profile as completed
            baseUser.userType = userType;
            baseUser.profileCompleted = true;
            await baseUser.save({ session });
            console.log('Debug - Updated base user type:', baseUser.userType);

            // Prepare complete profile data
            const completeProfileData = {
                ...existingUser.toObject(),
                ...profileData,
                userType,
                profileCompleted: true
            };
            delete completeProfileData._id; // Remove _id to avoid conflicts
            delete completeProfileData.__v; // Remove version key

            // Create or update using the discriminator model
            const profile = await UserModel.findByIdAndUpdate(
                userId,
                completeProfileData,
                {
                    new: true,
                    upsert: true,
                    session,
                    setDefaultsOnInsert: true
                }
            );
            console.log('Debug - Created/updated profile:', profile ? 'Success' : 'Failed');

            // Commit the transaction
            await session.commitTransaction();
            console.log('Debug - Transaction committed successfully');

            // Verify the final state
            const finalProfile = await UserModel.findById(userId);
            console.log('Debug - Final profile state:', finalProfile);

            return res.status(200).json({
                success: true,
                message: 'Profile completed successfully',
                data: finalProfile
            });

        } catch (error) {
            console.error('Debug - Transaction error:', error);
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
            console.log('Debug - Session ended');
        }

    } catch (error) {
        console.error('Profile completion error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to complete profile',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

/**
 * Get the complete profile for a user including type-specific data
 */
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log('Debug - Getting profile for user:', userId);

        // Get the base user document
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // If profile is not yet completed, return base user data
        if (!user.profileCompleted || !user.userType) {
            return res.status(200).json({
                success: true,
                data: {
                    ...user.toObject(),
                    profileStatus: 'incomplete'
                }
            });
        }

        // Get the type-specific profile model based on user type
        let TypeModel;
        switch (user.userType) {
            case 'INDIVIDUAL':
                TypeModel = Individual;
                break;
            case 'STARTUP':
                TypeModel = Startup;
                break;
            case 'INVESTOR':
                TypeModel = Investor;
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user type'
                });
        }

        // Get the complete profile with type-specific data
        const profile = await TypeModel.findById(userId);

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile details not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                ...profile.toObject(),
                profileStatus: 'complete'
            }
        });

    } catch (error) {
        console.error('Error fetching profile:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

/**
 * Update an existing profile
 */
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const updates = req.body;
        console.log('Debug - Updating profile for user:', userId);

        // Get the current user
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.profileCompleted || !user.userType) {
            return res.status(400).json({
                success: false,
                message: 'Profile not completed yet. Use complete-profile endpoint first.'
            });
        }

        // Get the correct model based on user type
        let TypeModel;
        switch (user.userType) {
            case 'INDIVIDUAL':
                TypeModel = Individual;
                break;
            case 'STARTUP':
                TypeModel = Startup;
                break;
            case 'INVESTOR':
                TypeModel = Investor;
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user type'
                });
        }

        // Validate the update data
        const validationErrors = validateProfileData(user.userType, updates);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        // Start a session for atomic operations
        const session = await User.startSession();
        session.startTransaction();

        try {
            // Update the type-specific profile
            const updatedProfile = await TypeModel.findByIdAndUpdate(
                userId,
                updates,
                { 
                    new: true,
                    runValidators: true,
                    session
                }
            );

            if (!updatedProfile) {
                throw new Error('Profile not found');
            }

            // If there are any common fields to update in base User document
            if (updates.location || updates.avatar) {
                await User.findByIdAndUpdate(
                    userId,
                    {
                        ...(updates.location && { location: updates.location }),
                        ...(updates.avatar && { avatar: updates.avatar })
                    },
                    { session }
                );
            }

            // Commit the transaction
            await session.commitTransaction();

            return res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: updatedProfile
            });

        } catch (error) {
            // If anything fails, abort the transaction
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};
