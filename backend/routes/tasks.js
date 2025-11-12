import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import Task from "../models/Task.js";

const router = express.Router();

// Get all tasks with pagination
router.get("/", protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tasks = await Task.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email");

    const total = await Task.countDocuments({ createdBy: req.user.id });

    res.json({
      status: "success",
      results: tasks.length,
      data: {
        tasks,
      },
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// Create task
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const task = await Task.create({
      title,
      description,
      status: status || "pending",
      createdBy: req.user.id,
    });

    await task.populate("createdBy", "name email");

    res.status(201).json({
      status: "success",
      data: {
        task,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// Update task
router.put("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      status: "success",
      data: {
        task,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// Delete task (Admin only)
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      status: "success",
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

export default router;
