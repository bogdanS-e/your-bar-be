import { ObjectId, WithId } from "mongodb";
import getDatabase from "../../loaders/mongoDB";
import { IUser } from "../../types/user";

const database = getDatabase();
const collection = database.collection<IUser>('users');

export const getUserByEmail = async (email: string): Promise<WithId<IUser> | null> => {
  const user = await collection.findOne({ email });

  return user;
}

export const addNewUser = async (user: IUser) => {
  await collection.insertOne(user);
}

export const addIngredientToUser = async (email: string, ingredientId: string) => {
  await collection.updateOne(
    { email },
    { $addToSet: { ingredients: new ObjectId(ingredientId) } }
  );
}

export const deleteIngredientFromUser = async (email: string, ingredientId: string) => {
  await collection.findOneAndUpdate(
    { email },
    { $pull: { ingredients: new ObjectId(ingredientId) } },
  );
}