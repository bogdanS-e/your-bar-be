import { WithId } from "mongodb";
import getDatabase from "../../loaders/mongoDB"
import { ICustomIngredient, IIngredient } from "../../types/ingredient";
import generateUniqueSlug from "../../utils/generateSlug";

const database = getDatabase();
const collection = database.collection<ICustomIngredient>('custom-ingredients');

export const getAllCustomIngredientsByEmail = async (email: string) => {
  const ingredients = await collection.find(
    { visibleTo: { $in: [email] } },
    { projection: { visibleTo: 0 } } // Exclude the visibleTo field
  ).toArray();

  return ingredients;
}

export const getCustomIngredientBySlug = async (slug: string): Promise<WithId<ICustomIngredient> | null> => {
  const ingredient = await collection.findOne({ slug }, { projection: { visibleTo: 0 } });

  return ingredient;
}

export const addNewCustomIngredient = async (ingredient: Omit<IIngredient, 'slug'>, email: string) => {
  const slug = await generateUniqueSlug(ingredient.nameEn, collection);
  
  await collection.insertOne({
    ...ingredient,
    slug,
    visibleTo: [email],
  });
}