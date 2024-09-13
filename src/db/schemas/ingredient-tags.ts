import getDatabase from "../../loaders/mongoDB"
import { IIngredientTag } from "../../types/ingredient";

const database = getDatabase();
const collection = database.collection<IIngredientTag>('ingredient-tags');

export const getMaxIngredientTagId = async () => {
  const result = await collection.aggregate<{ maxId: number }>([
    {
      $group: {
        _id: null,
        maxId: { $max: "$id" }
      }
    },
    {
      $project: {
        _id: 0,
        maxId: 1
      }
    }
  ]).toArray();

  return result[0].maxId;
}
