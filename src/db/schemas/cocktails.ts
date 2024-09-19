import { ObjectId, WithId } from "mongodb";
import getDatabase from "../../loaders/mongoDB";
import { ICocktail } from "../../types/cocktail";

const database = getDatabase();
const collection = database.collection<ICocktail>('cocktails');

export const getAllCocktails = async () => {
  const cocktails = await collection.find().toArray();

  return cocktails;
}

export const getCocktailById = async (id: string): Promise<WithId<ICocktail> | null> => {
  const cocktail = await collection.findOne({ _id: new ObjectId(id) });

  return cocktail;
}

export const addNewCocktail = async (cocktail: ICocktail) => {
  await collection.insertOne(cocktail);
}