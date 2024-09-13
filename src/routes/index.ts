import { Router } from 'express';

import ingredientsRouter from './ingredients';
import cocktailsRouter from './cocktails';
import addIngredientRouter from './add-ingredient.ts';
import addCocktailRouter from './add-cocktail.ts';

export default function () {
  const app = Router();

  ingredientsRouter(app);
  cocktailsRouter(app);
  addIngredientRouter(app);
  addCocktailRouter(app);

  return app;
}