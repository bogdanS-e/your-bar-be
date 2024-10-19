import { ObjectId, WithId } from "mongodb";
import getDatabase from "../../loaders/mongoDB";
import { ICocktail } from "../../types/cocktail";
import generateUniqueSlug from "../../utils/generateSlug";

const database = getDatabase();
const collection = database.collection<ICocktail>('cocktails');

export const getAllCocktails = async () => {
  const cocktails = await collection.find().toArray();

  return cocktails;
}

export const getCocktailBySlug = async (slug: string): Promise<WithId<ICocktail> | null> => {
  const cocktail = await collection.findOne({ slug });

  return cocktail;
}

export const getCocktailById = async (id: string): Promise<WithId<ICocktail> | null> => {
  const cocktail = await collection.findOne({ _id: new ObjectId(id) });

  return cocktail;
}

export const addNewCocktail = async (cocktail: Omit<ICocktail, 'slug'>) => {
  const slug = await generateUniqueSlug(cocktail.nameEn, collection);
  const cocktailWithSlug: ICocktail = {
    ...cocktail,
    slug,
  }

  await collection.insertOne(cocktailWithSlug);
}

export const editCocktailById = async (id: string, cocktail: Omit<ICocktail, 'slug'>) => {
  const updateData = {
    $set: {
      ...cocktail,
    },
  };

  await collection.updateOne({ _id: new ObjectId(id) }, updateData);
};