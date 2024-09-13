import getDatabase from "../../loaders/mongoDB";
import { ICocktail } from "../../types/cocktail";

const database = getDatabase();
const collection = database.collection<ICocktail>('cocktails');

export const getAllCocktails = async () => {
  const cocktails = await collection.find().toArray();

  return cocktails;
}

export const addNewCocktail = async (cocktail: ICocktail) => {
  await collection.insertOne(cocktail);
}