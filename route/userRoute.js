const express = require("express");
const router = express.Router();
const userController = require('../controller/userController') 
const {protect,authorizeRoles} = require('../middleware/auth')


router.post('/registerUser',userController.registerUser)

router.post(
    "/loginUser",
  
    userController.loginUser
  );
  
  router.put(
    "/update/:id",
    protect,
    authorizeRoles("admin", "user"),
    userController.updateUser
  );
  router.delete(
    "/delete/:id",
    protect,
    authorizeRoles("admin", "user"),
    userController.deleteUser
  );
  
  router.get(
    "/getAlluser",
    protect,
    authorizeRoles("admin"),
    userController.getAllUser
  );

module.exports = router;