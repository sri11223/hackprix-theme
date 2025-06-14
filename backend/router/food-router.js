const express =require('express')
const router=express.Router();
const foodcontroller=require('../controllers/food-controller')

router.post('/add',foodcontroller.Add)
router.get('/history',foodcontroller.History);


module.exports=router