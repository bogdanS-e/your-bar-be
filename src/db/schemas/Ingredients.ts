import getDatabase from "../../loaders/mongoDB"

const database = getDatabase();
const collection = database.collection('ingredients');

export const getAllIngredients = async () => {
  const ingredients = await collection.aggregate([
    {
      $unwind: "$tags"
    },
    {
      $lookup: {
        from: "ingredient-tags",
        localField: "tags",
        foreignField: "id",
        as: "tagDetails"
      }
    },
    {
      $unwind: "$tagDetails"
    },
    {
      $group: {
        _id: "$_id",
        nameEn: { $first: "$nameEn" },
        descriptionEn: { $first: "$descriptionEn" },
        tags: { $push: "$tagDetails.name" }
      }
    }
  ]).toArray();

  return ingredients;
}

export const addNewIngredient = async (doc: any) => {
  await collection.insertOne(doc);
}