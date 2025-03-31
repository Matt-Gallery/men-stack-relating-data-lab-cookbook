import express from "express";
import User from "../models/user.js";

const router = express.Router();

// GET - List all foods for a user
router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);

    // ✅ Grab message from session (if any), then clear it
    const message = req.session.message;
    delete req.session.message;

    res.render("foods/index.ejs", {
      user: req.session.user,
      foods: user.foods,
      message, // ✅ pass to view
    });
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});


// GET - Render form to add new food
router.get("/new", (req, res) => {
  try {
    res.render("foods/new.ejs", { user: req.session.user });
  } catch (error) {
    console.error(error);
  }
});

// POST - Handle form submission to add a new food
router.post("/", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);

    user.foods.push({
      name: req.body.name,
      calories: req.body.calories,
      price: req.body.price,
      quantity: req.body.quantity,
    });

    await user.save();

    // ✅ Set flash message in session
    req.session.message = "New food item added successfully!";
    
    res.redirect(`/users/${user._id}/foods`);
  } catch (error) {
    console.error("Error adding food:", error);
    res.redirect(`/users/${req.session.user._id}/foods`);
  }
});



// GET - Show a specific food item
router.get("/:foodId", async (req, res) => {
  try {
    const user = await User.findById(req.session.user);
    const food = user.foods.id(req.params.foodId);

    if (!food) {
      return res.redirect("/users/" + req.session.user._id + "/foods");
    }

    res.render("foods/show.ejs", {
      user: req.session.user,
      food: food,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});

// GET - Render form to edit a food item
router.get("/:foodId/edit", async (req, res) => {
  try {
    const user = await User.findById(req.session.user);
    const food = user.foods.id(req.params.foodId);

    if (!food) {
      return res.redirect("/users/" + req.session.user._id + "/foods");
    }

    res.render("foods/edit.ejs", {
      user: req.session.user,
      food: food,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});
// PUT - Update a food item
router.put("/:foodId", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    const food = user.foods.id(req.params.foodId);

    if (!food) {
      return res.status(404).send("Food not found");
    }

    // Update fields
    food.name = req.body.name;
    food.calories = req.body.calories;
    food.price = req.body.price;
    food.quantity = req.body.quantity;

    await user.save();

    res.redirect(`/users/${user._id}/foods/${food._id}`);
  } catch (error) {
    console.error("Error updating food:", error);
    res.redirect(`/users/${req.session.user._id}/foods`);
  }
});

// DELETE - Remove a food item
router.delete("/:foodId", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);

    user.foods.id(req.params.foodId).deleteOne();

    await user.save();

    res.redirect(`/users/${user._id}/foods`);
  } catch (error) {
    console.error("Error deleting food:", error);
    res.redirect(`/users/${req.session.user._id}/foods`);
  }
});


export default router;
