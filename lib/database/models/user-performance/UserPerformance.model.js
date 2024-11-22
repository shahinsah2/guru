const mongoose = require("mongoose");

const UserPerformanceSchema = new mongoose.Schema(
  {
    userCode: {
      type: String,
      required: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    teamHead: {
      type: String,
      default: "-",
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    performance: {
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
