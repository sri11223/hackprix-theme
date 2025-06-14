// Import the User and Food models for database interaction
const User = require('../models/usermodel'); // User model (not used in this function but likely included for future references)
const Food = require('../models/Foodmodel'); // Food model to interact with food items in the database

// Define the Add function to handle adding food items to the database
const Add = async (req, res) => {
    try {
        // Log the entire request body for debugging
        console.log("Request body:", req.body);
        const{username,foodItems}=req.body;        // Extract the username and foodItems from the request body
        

        // Log the extracted values
        console.log("Username:", username);
        console.log("Food Items:", foodItems);
        const mealType=foodItems[0].meal_type;
        console.log(mealType) //

        // Validate that foodItems is an array and contains items
        if (!Array.isArray(foodItems) || foodItems.length === 0||!username) {
            return res.status(400).json({ msg: "No food items provided." });
        }

        // Get the meal type from the first food item
         // Extract mealType from the first food item

        // Check if a Food document exists for the given username and meal type on today's date
        let foodEntry = await Food.findOne({
            institute_username: username,
            'mealTypes.type': mealType,
            'mealTypes.date': new Date().toISOString().split('T')[0] // Match by date
        });

        console.log("Existing Food Entry:", foodEntry);

        if (foodEntry) {
            // If a food entry already exists for today's meal type
            const mealTypeEntry = foodEntry.mealTypes.find(mt => mt.type === mealType);
            if (mealTypeEntry) {
                // Add new items to the existing meal type's items array
                mealTypeEntry.items.push(...foodItems.map(item => ({
                    food_name: item.food_name,
                    quantity: item.quantity,
                    date_time: item.date_time || new Date()
                })));
            } else {
                // If the meal type doesn't exist, create a new entry for it
                foodEntry.mealTypes.push({
                    type: mealType,
                   
                    items: foodItems.map(item => ({
                        food_name: item.food_name,
                        quantity: item.quantity,
                        date_time: item.date_time || new Date(),
                        date: new Date().toISOString().split('T')[0],
                    }))
                });
            }
            await foodEntry.save();
            console.log("Updated Food Entry:", foodEntry);
        } else {
            // If no entry exists for the username, create a new Food document
            foodEntry = new Food({
                institute_username: username,
                mealTypes: [{
                    type: mealType,
                    items: foodItems.map(item => ({
                        food_name: item.food_name,
                        quantity: item.quantity,
                        date_time: item.date_time || new Date(),
                    date: new Date().toISOString().split('T')[0]
                    
                    }))
                }]
            });
            await foodEntry.save();
            console.log("New Food Entry Created:", foodEntry);
        }

        res.status(201).json({ msg: "Food items added successfully!", foodItems: foodEntry });
    } catch (error) {
        console.error('Error adding food items:', error);
        res.status(500).json({ msg: "An error occurred while adding food items.", error: error.message });
    }
};



const History = async (req, res) => {
    const { username } = req.query;

    try {
        // Fetch all food entries for the user, sorted by dateAdded in descending order
        const foodEntries = await Food.find({ institute_username: username }).sort({ dateAdded: -1 });

        const groupedFoodEntries = {}; // Initialize an object to group entries by date and mealType

        foodEntries.forEach(entry => {
            // Format the date to YYYY-MM-DD for consistent grouping
            const date = entry.dateAdded.toISOString().split('T')[0];

            // Initialize date grouping if it doesn't exist
            if (!groupedFoodEntries[date]) {
                groupedFoodEntries[date] = {
                    Breakfast: [],
                    Lunch: [],
                    Dinner: [],
                    Others: []
                };
            }

            // Iterate over mealTypes within each entry
            entry.mealTypes.forEach(meal => {
                const mealType = meal.type || 'Others'; // Default to 'Others' if type is missing
                
                // Push food items from each meal type into the correct mealType category
                if (groupedFoodEntries[date][mealType]) {
                    groupedFoodEntries[date][mealType].push(...meal.items);
                } else {
                    // Fallback for any unexpected meal type
                    groupedFoodEntries[date].Others.push(...meal.items);
                }
            });
        });

        // Format the result as an array of objects for each date
        const result = Object.entries(groupedFoodEntries).map(([date, meals]) => ({
            date_time: date,
            meals: Object.entries(meals).map(([mealType, items]) => ({
                mealType,
                food_items: items
            }))
        }));

        res.json(result); // Return the formatted response
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};
// Export the Add function so it can be used in other parts of the application
module.exports = { Add,History };
