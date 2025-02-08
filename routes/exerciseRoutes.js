import express from "express";
import { find } from "../db/exercises.js";

const router = express.Router();
router.get("/", getExercises);
// router.get("/:id", getExerciseById);

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

// async function getExerciseById(req, res) {
//   console.log("Getting exercise by ID");
//   try {
//     const exercise = await findById(req.params.id);
//     if (exercise) {
//       console.log(exercise);
//       res.json(exercise);
//     }
//   } catch (error) {
//     console.error("Error getting exercise by ID:", error);
//     res.status(500).send("Error getting exercise by ID");
//   }
// }

export default router;
