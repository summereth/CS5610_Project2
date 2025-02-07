import { exercises } from "./data/exercises.js";
import connectDB from "./connectDB.js";

const dbName = "fitness_db";

async function importData() {
  let client;

  try {
    // Connect to database
    client = await connectDB();

    // Get database and collection
    const db = client.db(dbName);
    const collection = db.collection("exercises");

    // Delete existing data (optional)
    await collection.deleteMany({});

    // Insert the exercise data
    const result = await collection.insertMany(exercises);
    console.log(`Successfully inserted ${result.insertedCount} exercises`);

    // Create an index on muscle group for better query performance
    await collection.createIndex({ muscleGroup: 1 });

    console.log("Data imported successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    // Close the connection
    if (client) {
      await client.close();
      console.log("Database connection closed");
    }
  }
}

async function destroyData() {
  let client;

  try {
    // Connect to database
    client = await connectDB();

    // Get database and collection
    const db = client.db(dbName);
    const collection = db.collection("exercises");

    // Delete existing data
    await collection.deleteMany({});
    console.log("Data destroyed successfully!");
  } catch (error) {
    console.error("Error destroying database:", error);
    process.exit(1);
  } finally {
    // Close the connection
    if (client) {
      await client.close();
      console.log("Database connection closed");
    }
  }
}

// Run the seeder
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
