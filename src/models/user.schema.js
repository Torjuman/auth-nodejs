// Importing mongoose package
const mongoose = require("mongoose");

// Importing bcryptjs package to encrypt password
const bcryptjs = require("bcryptjs");

// Importing jsonwebtoken for generating token
const JWT = require("jsonwebtoken");

// Importing config file to set secret value and expiry
const config = require("../configs/index");

// Importing crypto package to generate long string
const crypto = require("crypto");

// Destructuring Schema and model from mongoose
const { Schema, model } = mongoose;

/**
 * @UserSchema It is an schema for User
 * @values name, email, password, forgotPasswordToken and forgotPasswordExpiry with timestamps
 */
const UserSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxLength: [50, "Name must be less than 50"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },

    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [8, "password must be at least 8 characters"],
      select: false,
    },

    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);

// Encrypt password - hooks
UserSchema.pre("save", async function (next) {
  // If password is not a new one don't modifie the older one just go to next
  if (!this.isModified("password")) return next();

  // If password is a new one then modifie the older one and go to next
  this.password = await bcryptjs.hash(this.password, 12);
  next();
});

// Add some featuers to schema directly
UserSchema.methods = {
  // Compare password
  comparePassword: async function (enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.password);
  },

  // Generate JWT Token for cookies
  getJwtToken: function () {
    return JWT.sign({ _id: this._id }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRY,
    });
  },

  generateForgetPasswordTokenExpiry: function () {
    const forgetToken = crypto.randomBytes(30).toString("hex");

    // Save token and expiry time to Database
    this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(forgetToken)
      .digest("hex");

    this.forgotPasswordExpiry = Date.now() + 1000 * 60 * 20;

    // return the value
    return forgetToken;
  },
};

const User = model("User", UserSchema);
module.exports = User;
