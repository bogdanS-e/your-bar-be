import getDatabase from "../../loaders/mongoDB"
import { IIngredient } from "../../types/ingredient";

const database = getDatabase();
const collection = database.collection<IIngredient>('ingredients');

export const getAllIngredients = async () => {
  const ingredients = await collection.find().toArray();

  return ingredients;
}

export const addNewIngredient = async (ingredient: IIngredient) => {
  await collection.insertOne(ingredient);
}