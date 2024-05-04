const express = require("express");
const router = express.Router();
const {registerUser,loginUser} = require("../controllers/userController");
const {createPost,getLocationData,getActiveCount, updatePost, deletePost} = require("../controllers/postController")
const { authenticateToken } = require('../middleware/config');
//const { authenticate } = require("passport");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/createPost", authenticateToken(), createPost);
router.get("/getData",authenticateToken(),getLocationData);
router.put("/update/:postId", authenticateToken(), updatePost);
router.delete("/delete/:postId", authenticateToken(), deletePost)
router.get("/getCount",authenticateToken(),getActiveCount)


module.exports = router;
