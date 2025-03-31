import mongoose from "mongoose";

const foodSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  foods: [foodSchema],
});

const User = mongoose.model("User", userSchema);

export default User;