const User = require('../models/usermodel');
const Food = require('../models/Foodmodel');
const Booking = require('../models/Bookingmodel')

const Foodlistings = async (req, res) => {
    try {
        console.log("Fetching available food listings...");
        const start = new Date();
        start.setUTCHours(0, 0, 0, 0);

        const end = new Date();
        end.setUTCHours(23, 59, 59, 999);

        console.log("Start Date UTC:", start.toISOString());
        console.log("End Date UTC:", end.toISOString());

        const foodAvailable = await Food.find({
            dateAdded: { $gte: start, $lt: end }
        });

        console.log("Filtered Data:", foodAvailable);

        const availableFood = foodAvailable.map(institute => ({
            instituteUsername: institute.institute_username,
            meals: institute.mealTypes.map(meal => ({
                type: meal.type,
                items: meal.items.filter(item => item.availability === 'YES')
            }))
        }));

        console.log("Available Food:", availableFood);

        res.status(200).json({ success: true, availableFood });
    } catch (error) {
        console.error("Error fetching food listings:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const bookFood = async (req, res, io,users) => {
    try {
      const { instituteUsername, mealType, foodItems, ngoUsername } = req.body;
  
      if (!instituteUsername || !mealType || !foodItems || !ngoUsername) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }
      console.log(foodItems);
  
      const foodListing = await Food.findOne({ institute_username: instituteUsername });
  
      if (!foodListing) {
        return res.status(404).json({ success: false, message: "Food listing not found" });
      }
  
      let foodUpdated = false;
      foodListing.mealTypes.forEach((meal) => {
        if (meal.type === mealType) {
          meal.items.forEach((item) => {
            console.log(`Checking item: ${item.food_name}, Availability: ${item.availability}`);
            if (foodItems.includes(item.food_name) && item.availability === "YES") {
              item.availability = "NO";
              foodUpdated = true;
            }
          });
        }
      });
      console.log(foodUpdated)
      console.log(foodItems);
      if (!foodUpdated) {
        return res.status(400).json({ success: false, message: "Food item already booked or unavailable" });
      }
  
      // Mark the array as modified
      foodListing.markModified("mealTypes");
  
      await foodListing.save();  // Ensure the changes are saved
 
      const newBooking = new Booking({
        instituteUsername,
        ngoUsername,
        mealType,
        foodItems,
        status: "pending",
      });
  
      await newBooking.save();
  console.log(users,"hello")
  if (users[instituteUsername]) {
    io.to(users[instituteUsername].socketId).emit("newBookingRequest", {
      message: `New booking request from ${ngoUsername} for ${foodItems}`,
      ngoUsername,
      foodItems,
      mealType,
    });
  }
  
      res.status(200).json({ success: true, message: "Food booked successfully and institute notified" });
    } catch (error) {
      console.error("Error booking food:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  


module.exports = { Foodlistings, bookFood };
