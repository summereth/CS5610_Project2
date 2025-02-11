import { MongoClient } from "mongodb";
import "dotenv/config";

// Random Exercise IDs from your exercise collection)
const exerciseIds = [
  "67a6d702499b91c550bb3d75",
  "67a6d702499b91c550bb3d76",
  "67a6d702499b91c550bb3d7a",
  "67a6d702499b91c550bb3d7b",
  "67a6d702499b91c550bb3d81",
  "67a6d702499b91c550bb3d82",
  "67a6d702499b91c550bb3d83",
  "67a6d702499b91c550bb3d8c",
];

// Function to generate a random workout name
function generateWorkoutName() {
  const words = [
    "Push",
    "Pull",
    "Legs",
    "Core",
    "Upper",
    "Lower",
    "Full",
    "Body",
    "Strength",
    "Power",
    "Endurance",
    "Cardio",
    "HIIT",
    "Circuit",
  ];
  const wordCount = Math.floor(Math.random() * 4) + 2; // Random 2-5 words
  const name = [];

  for (let i = 0; i < wordCount; i++) {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    if (!name.includes(randomWord)) {
      name.push(randomWord);
    }
  }

  return name.join(" ");
}

// Function to generate a random exercise
function generateExercise() {
  return {
    exerciseId: exerciseIds[Math.floor(Math.random() * exerciseIds.length)],
    weight: Math.floor(Math.random() * 191) + 10, // Random 10-200
    sets: Math.floor(Math.random() * 10) + 1, // Random 1-10
    reps: Math.floor(Math.random() * 18) + 3, // Random 3-20
  };
}

// Function to generate a single workout plan
function generateWorkoutPlan() {
  const exerciseCount = Math.floor(Math.random() * 8) + 3; // Random 3-10 exercises
  const exercises = [];

  for (let i = 0; i < exerciseCount; i++) {
    exercises.push(generateExercise());
  }

  const totalSets = exercises.reduce((sum, exercise) => sum + exercise.sets, 0);
  const totalWeight = exercises.reduce(
    (sum, exercise) => sum + exercise.weight * exercise.sets * exercise.reps,
    0,
  );

  return {
    name: generateWorkoutName(),
    exercises,
    createdAt: new Date(),
    exerciseCount,
    totalSets,
    totalWeight,
  };
}

// Function to generate multiple workout plans
async function generateAndInsertWorkoutPlans(count) {
  const workoutPlans = [];

  for (let i = 0; i < count; i++) {
    workoutPlans.push(generateWorkoutPlan());
  }

  // Connect to MongoDB and insert the data
  try {
    const client = await MongoClient.connect(process.env.MONGO_URI);
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection("plans");

    const result = await collection.insertMany(workoutPlans);
    console.log(`Successfully inserted ${result.insertedCount} workout plans`);

    await client.close();
  } catch (err) {
    console.error("Error inserting workout plans:", err);
  }
}

const rows = process.argv[2] || 1;
generateAndInsertWorkoutPlans(rows);
