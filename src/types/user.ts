import { ObjectId } from 'mongodb';

export interface IUser {
  name: string;
  picture: string;
  email: string;
  ingredients: ObjectId[];
  favoriteCocktails: ObjectId[];
}
