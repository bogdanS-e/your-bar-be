import getDatabase from "../../loaders/mongoDB"
import { ICustomIngredient, IIngredient } from "../../types/ingredient";

const database = getDatabase();
const collection = database.collection<ICustomIngredient>('custom-ingredients');

export const getAllCustomIngredientsByEmail = async (email: string) => {
  const ingredients = await collection.find(
    { visibleTo: { $in: [email] } },
    { projection: { visibleTo: 0 } } // Exclude the visibleTo field
  ).toArray();

  return ingredients;
}

export const addNewCustomIngredient = async (ingredient: IIngredient, email: string) => {
  await collection.insertOne({
    ...ingredient,
    visibleTo: [email],
  });
}