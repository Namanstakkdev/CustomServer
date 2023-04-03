const {
  register,
  login,
  signOut,
  forgotPassword,
  resetPassword,
  test,
} = require("../Controllers/AuthControllers");
const { checkUser } = require("../Middlewares/AuthMiddlewares");

const router = require("express").Router();

router.post("/", checkUser);
router.get("/logout", signOut);
router.post("/register", register);
router.post("/login", login);
router.post("/send", forgotPassword);
router.post("/test", test);
router.post("/resetpassword", resetPassword);

module.exports = router;
