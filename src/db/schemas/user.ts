import { WithId } from "mongodb";
import getDatabase from "../../loaders/mongoDB";

const database = getDatabase();
const collection = database.collection<IUser>('users');

export const getUserByEmail = async (email: string): Promise<WithId<IUser> | null> => {
  const user = await collection.findOne({ email });

  return user;
}

export const addNewUser = async (user: IUser) => {
  await collection.insertOne(user);
}