import express from "express";
import { find, findById, insertOne } from "../db/plans.js";
import { findById as findExerciseById } from "../db/exercises.js";

const router = express.Router();
router.get("/", getPlans);
router.get("/:id", getPlanById);
router.post("/create", createPlan);

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

async function getPlanById(req, res) {
  try {
    const plan = await findById(req.params.id);

    if (plan) {
      const convertedExercises = await Promise.all(
        plan.exercises.map(async (exercise) => {
          const exerciseName = await findExerciseById(exercise.exerciseId);
          console.log("found: ", exerciseName);
          return { ...exercise, name: exerciseName.name };
        }),
      );

      res.json({ ...plan, exercises: convertedExercises });
    } else {
      res.status(404).send("Plan not found");
    }
  } catch (error) {
    console.error("Error getting exercise by ID:", error);
    res.status(500).send("Error getting exercise by ID");
  }
}

async function createPlan(req, res) {
  const { name, exercises } = req.body;
  if (!name || !exercises || !exercises.length) {
    res.status(400).send("Name and exercises are required");
    return;
  }

  const exerciseCount = exercises.length;
  const totalSets = exercises.reduce((acc, curr) => acc + curr.sets, 0);
  const totalWeight = exercises.reduce(
    (acc, curr) => acc + curr.sets * curr.reps * curr.weight,
    0,
  );
  const newPlan = {
    name,
    exercises,
    createdAt: new Date(),
    exerciseCount,
    totalSets,
    totalWeight,
  };

  try {
    // Create plan
    const result = await insertOne(newPlan);
    res.json(result);
  } catch (error) {
    console.error("Error creating plan:", error);
    res.status(500).send("Error creating plan");
  }
}

export default router;
