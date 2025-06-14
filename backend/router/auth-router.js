const express =require('express')
const router=express.Router();
const contollers=require('../controllers/auth-contoller');
const {validate}=require('../middleware/validate-middleware')
const schemas=require('../validation/auth-validator')


router.route('/').get(contollers.home);
router.route('/register').post(contollers.register)
router.route('/login').post(contollers.login);
router.route('/institutes').get(contollers.institutes)
module.exports=router;
