import express from "express";
import { find } from "../db/plans.js";

const router = express.Router();
router.get("/", getPlans);
// router.get("/:id", getPlanById);
// router.post("/create", createPlan);

async function getPlans(req, res) {
  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder || "desc";

  try {
    const plans = await find({ [sortBy]: sortOrder === "asc" ? 1 : -1 });
    res.json(plans);
  } catch (error) {
    console.error("Error getting plans:", error);
    res.status(500).send("Error getting plans");
  }
}

// async function getPlanById(req, res) {}

// async function createPlan(req, res) {}

export default router;
