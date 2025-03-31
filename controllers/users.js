// Used ChatGPT throughout

import express from "express";
import User from "../models/user.js";

const router = express.Router();

// GET /users - List all users
router.get("/", async (req, res) => {
    try {
      const users = await User.find();
  
      res.render("users/index.ejs", { users });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.redirect("/");
    }
  });
  

// GET /users/:userId - Show a single user's pantry
router.get("/:userId", async (req, res) => {
    
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("users/show.ejs", {
      user,
      foods: user.foods,
    });
  } catch (error) {
    console.error("Error showing user:", error);
    res.redirect("/users");
  }
  console.log("Session user at /users:", req.session.user);
});

export default router;
