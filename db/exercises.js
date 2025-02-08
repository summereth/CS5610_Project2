import { MongoClient, ObjectId } from "mongodb";

const collection_name = "exercises";

async function find(query = {}) {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    // Connect to database
    await client.connect();

    // Get database and collection
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(collection_name);

    // Find exercises
    const exercises = await collection.find(query).toArray();
    return exercises;
  } catch (error) {
    console.error("Error getting exercises:", error);
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
    const exercises = await collection.findOne({
      _id: ObjectId.createFromHexString(id),
    });
    return exercises;
  } catch (error) {
    console.error("Error getting exercise by ID:", error);
    throw error;
  } finally {
    // Close the connection
    if (client) {
      await client.close();
    }
  }
}

export { find, findById };
