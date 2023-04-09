const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/middlewares");

const { landingPage, loginUser, registerUSer, userProfile, addTask, editTask, updateTask, deleteTask, logout } = require("../controllers/controllers");


router.route("/").get(landingPage).post(loginUser);
router.route("/register").post(registerUSer);
router.route("/profile").get(checkAuth, userProfile).post(checkAuth, addTask);
router.route("/update/:idUser/:idItem").get(checkAuth, editTask).post(checkAuth, updateTask)  // instead of post use patch and also set method = "patch" in form
router.route("/delete/:idUser/:idItem").get(checkAuth, deleteTask)
router.route("/logout").get(checkAuth, logout);

module.exports = router;