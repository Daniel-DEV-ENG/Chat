const RegisterController = require('../Controllers/UserController')
const router = require("express").Router();

router.post("/login", RegisterController.Login);
router.post("/register", RegisterController.register);
router.get("/allusers/:id", RegisterController.getAllUsers);
router.put("/setAvatar/:id", RegisterController.setAvatar);
 router.get("/logout/:id", RegisterController.logOut);

module.exports = router;
