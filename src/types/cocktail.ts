import { ObjectId } from 'mongodb';

export enum CocktailTag {
  NonAlcoholic,
  Strong,
  Long,
  Soft,
  MediumStrength,
  Shooter,
  Custom,
}

export enum CocktailUnit {
  Cl,
  Oz,
  BarSpoon,
  Sprig,
  Gram,
  Dash,
  Drop,
  Cube,
  Leaf,
  Slice,
  Ml,
  Half,
  Splash,
  Tablespoon,
  Stalk,
  Zest,
  Third,
  Pinch,
  Teaspoon,
  Part,
  Cup,
  Quarter,
  Scoop,
}

export interface ICocktailIngredient {
  ingredientId: ObjectId;
  value: number;
  unit: CocktailUnit;
  isOptional: boolean;
  isDecoration: boolean;
}

export interface ICocktail {
  nameEn: string;
  descriptionEn: string;
  recipeEn: string;
  image: string | null;
  tags: CocktailTag[];
  ingredients: ICocktailIngredient[];
  slug: string;
}
