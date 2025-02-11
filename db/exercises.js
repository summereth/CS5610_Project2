import { MongoClient, ObjectId } from "mongodb";

function getClientAndCollection() {
  const collection_name = "exercises";
  const mongo_uri = process.env.MONGO_URI || "mongodb://localhost:27017";

  const client = new MongoClient(mongo_uri);
  const db = client.db(process.env.DB_NAME);
  const collection = db.collection(collection_name);

  return { client, collection };
}

async function find(query = {}) {
  const { client, collection } = getClientAndCollection();

  try {
    // Connect to database
    await client.connect();

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
  const { client, collection } = getClientAndCollection();

  try {
    // Connect to database
    await client.connect();

    // Find exercises
    const exercise = await collection.findOne({
      _id: ObjectId.createFromHexString(id),
    });
    return exercise;
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
