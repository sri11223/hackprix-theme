const express =require('express')
const router=express.Router();
const contactform=require('../controllers/contact-controller')

router.route('/contact').post(contactform)
module.exports=router;  //exporting the router to use in app.js