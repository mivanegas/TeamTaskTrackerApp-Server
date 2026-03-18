const mongoose = require("mongoose");
const User = require("./user.models");

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 5,
    },
    description: {
      type: String,
      default: "",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Planning", "To do", "In progress", "Done"],
      default: "To do",
    },
    deadline: {
      type: Date,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
