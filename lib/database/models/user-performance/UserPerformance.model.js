const mongoose = require("mongoose");

const UserPerformanceSchema = new mongoose.Schema(
  {
    user_code: {
      type: String,
      required: true,
      unique: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: false,
    },
    teamHead: {
      type: String,
      default: "-",
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: false,
    },
    joining_date: {
      type: Date,
      required: true,
    },
    performance_score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.UserPerformance ||
  mongoose.model("UserPerformance", UserPerformanceSchema);
