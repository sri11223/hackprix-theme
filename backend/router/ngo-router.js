const express = require('express');
const router = express.Router();
const ngocontrollers = require('../controllers/ngo-controller');
const { getInstituteRequests } = require("../controllers/BookingController");

module.exports = (io,users) => {
    router.get('/food-availability', ngocontrollers.Foodlistings);
    router.post('/book-food', (req, res) => ngocontrollers.bookFood(req, res, io,users));
    router.get("/requests", getInstituteRequests);
    return router;
};
