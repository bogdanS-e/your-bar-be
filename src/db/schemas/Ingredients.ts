import { ObjectId, WithId } from "mongodb";
import getDatabase from "../../loaders/mongoDB"
import { IIngredient } from "../../types/ingredient";

const database = getDatabase();
const collection = database.collection<IIngredient>('ingredients');

export const getAllIngredients = async () => {
  const ingredients = await collection.find().toArray();

  return ingredients;
}

export const getIngredientById = async (id: string): Promise<WithId<IIngredient> | null> => {
  const ingredient = await collection.findOne({ _id: new ObjectId(id) });

  return ingredient;
}

export const addNewIngredient = async (ingredient: IIngredient) => {
  await collection.insertOne(ingredient);
}