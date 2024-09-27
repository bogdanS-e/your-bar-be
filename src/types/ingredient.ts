export enum IngredientTag {
  Beverages,
  Strong,
  Syrup,
  Soft,
  Fruit,
  Juice,
  Other,
  Custom,
}

export interface IIngredient {
  nameEn: string;
  descriptionEn: string;
  image: string | null;
  tags: IngredientTag[];
}

export interface ICustomIngredient extends IIngredient {
  visibleTo: string[];
}

export interface IIngredientTag {
  id: number;
  name: string;
}
