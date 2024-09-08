import { IWithObjectId } from "./common";

export enum IngredientTag {
  Beverages,
  Strong,
  Syrup,
  Soft,
  Fruit,
  Juice,
  Other,
}

export interface IIngredient {
  nameEn: string;
  descriptionEn: string;
  image: string | null;
  tags: IngredientTag[];
}

export type TMongoIngredient = IWithObjectId & IIngredient;