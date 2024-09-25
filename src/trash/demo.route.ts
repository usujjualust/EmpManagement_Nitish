import { Router } from "express";

const router = Router();
let message =""
router.route('/').post(
(req, res)=>{
//   console.log(req)  
  message = req.body.message;
 res.status(200).json({message:`${message}, message received succesfully!`})
}
)

router.route('/').get(
    (req, res)=>{
    if (message){
        res.send(message) 
        // res.status(200).json({message: message})
    }else{
        res.status(404).json({message:"ERROR"})
    }
    }
)

export default router;