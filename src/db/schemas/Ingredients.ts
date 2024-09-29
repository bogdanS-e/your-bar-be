import { WithId } from "mongodb";
import getDatabase from "../../loaders/mongoDB"
import { IIngredient } from "../../types/ingredient";
import generateUniqueSlug from "../../utils/generateSlug";

const database = getDatabase();
const collection = database.collection<IIngredient>('ingredients');

export const getAllIngredients = async () => {
  const ingredients = await collection.find().toArray();

  return ingredients;
}

export const getIngredientBySlug = async (slug: string): Promise<WithId<IIngredient> | null> => {
  const ingredient = await collection.findOne({ slug });

  return ingredient;
}

export const addNewIngredient = async (ingredient: Omit<IIngredient, 'slug'>) => {
  const slug = await generateUniqueSlug(ingredient.nameEn, collection);
  const ingredientWithSlug: IIngredient = {
    ...ingredient,
    slug,
  }

  await collection.insertOne(ingredientWithSlug);
}