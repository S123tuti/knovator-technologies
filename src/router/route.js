const express = require("express");
const router = express.Router();
const {registerUser,loginUser} = require("../controllers/userController");
const {createPost,getLocationData,getActiceCount} = require("../controllers/postController")
const { authenticateToken } = require('../middleware/config');

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post('/createPost', authenticateToken(), createPost);
router.get("/getData",authenticateToken(),getLocationData);
router.get("getCount",authenticateToken(),getActiceCount)


module.exports = router;
