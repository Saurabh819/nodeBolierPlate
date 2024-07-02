const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the user schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "is invalid"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: [String],
      default: ["user"],
    },
  },
  { timestamps: true }
);

// Middleware to update the `updatedAt` field before saving
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the user model
const User = mongoose.model("User", userSchema);

module.exports = User;
