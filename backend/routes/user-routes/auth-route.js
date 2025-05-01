const express = require("express");
const router = express.Router();
const { userSignup, userSignin, checkuser } = require("../../controllers/user-controllers/auth-controller");
const userAuth = require("../../middlewares/auth-middleware")

router.post("/signup", userSignup);
router.post("/signin", userSignin);
router.get("/check", userAuth, checkuser);


module.exports = router;
