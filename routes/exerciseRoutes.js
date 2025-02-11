import express from "express";
import { find, findById } from "../db/exercises.js";

async function getExercises(req, res) {
  const muscleGroup = req.query.muscleGroup;
  const query = muscleGroup ? { muscleGroup } : {};
  try {
    const exercises = await find(query);
    res.json(exercises);
  } catch (error) {
    console.error("Error getting exercises:", error);
    res.status(500).send("Error getting exercises");
  }
}

async function getExerciseById(req, res) {
  try {
    const exercise = await findById(req.params.id);
    if (exercise) {
      res.json(exercise);
    } else {
      res.status(404).send("Exercise not found");
    }
  } catch (error) {
    console.error("Error getting exercise by ID:", error);
    res.status(500).send("Error getting exercise by ID");
  }
}

const router = express.Router();
router.get("/", getExercises);
router.get("/:id", getExerciseById);

export default router;
