import { MongoClient, ObjectId } from "mongodb";

function getClientAndCollection() {
  const collection_name = "plans";
  const mongo_uri = process.env.MONGO_URI || "mongodb://localhost:27017";

  const client = new MongoClient(mongo_uri);
  const db = client.db(process.env.DB_NAME);
  const collection = db.collection(collection_name);

  return { client, collection };
}

async function find(sort = {}) {
  const { client, collection } = getClientAndCollection();

  try {
    // Connect to database
    await client.connect();

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
  const { client, collection } = getClientAndCollection();

  try {
    // Connect to database
    await client.connect();

    // Find the plan by ID
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
  const { client, collection } = getClientAndCollection();

  try {
    // Connect to database
    await client.connect();

    // Insert plan
    const result = await collection.insertOne(plan);
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

async function deleteOne(id) {
  const { client, collection } = getClientAndCollection();

  try {
    // Connect to database
    await client.connect();

    // Delete plan
    const result = await collection.deleteOne({
      _id: ObjectId.createFromHexString(id),
    });
    return result;
  } catch (error) {
    console.error("Error deleting plan by ID:", error);
    throw error;
  } finally {
    // Close the connection
    if (client) {
      await client.close();
    }
  }
}

async function updatePlanName(id, newPlanName) {
  const { client, collection } = getClientAndCollection();

  try {
    // Connect to database
    await client.connect();

    // Update plan
    const result = await collection.updateOne(
      {
        _id: ObjectId.createFromHexString(id),
      },
      {
        $set: {
          name: newPlanName,
        },
      },
    );
    return result;
  } catch (error) {
    console.error("Error updating plan by ID:", error);
    throw error;
  } finally {
    // Close the connection
    if (client) {
      await client.close();
    }
  }
}

export { find, findById, insertOne, deleteOne, updatePlanName };
