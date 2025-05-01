const express = require("express");
const router = express.Router();
const { adminSignup, adminSignin, checkAdmin } = require("../../controllers/admin-controller/adminAuth-controller");
const adminAuth = require("../../middlewares/adminAuth-middleware")

router.post("/signup", adminSignup);
router.post("/signin", adminSignin);
router.get("/check", adminAuth, checkAdmin);


module.exports = router;
