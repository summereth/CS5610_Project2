import { MongoClient, ObjectId } from "mongodb";

const collection_name = "plans";

async function find(sort = {}) {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    // Connect to database
    await client.connect();

    // Get database and collection
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(collection_name);

    // Find plans
    const plans = await collection
      .find()
      .sort(sort)
      .project({ exercises: 0 })
      .toArray();

    return plans;
  } catch (error) {
    console.error("Error getting plans:", error);
    throw error;
  } finally {
    // Close the connection
    if (client) {
      await client.close();
    }
  }
}

async function findById(id) {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    // Connect to database
    await client.connect();

    // Get database and collection
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(collection_name);

    // Find exercises
    const plan = await collection.findOne({
      _id: ObjectId.createFromHexString(id),
    });
    return plan;
  } catch (error) {
    console.error("Error getting plan by ID:", error);
    throw error;
  } finally {
    // Close the connection
    if (client) {
      await client.close();
    }
  }
}

async function insertOne(plan) {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    // Connect to database
    await client.connect();

    // Get database and collection
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(collection_name);

    // Insert plan
    const result = await collection.insertOne(plan);
    console.log("Result of insertion", result);
    return result;
  } catch (error) {
    console.error("Error inserting plan:", error);
    throw error;
  } finally {
    // Close the connection
    if (client) {
      await client.close();
    }
  }
}

export { find, findById, insertOne };
