import { Router } from 'express';

import ingredientsRouter from './ingredients';
import ingredientRouter from './ingredient';
import cocktailsRouter from './cocktails';
import cocktailRouter from './cocktail';
import addIngredientRouter from './add-ingredient';
import addCocktailRouter from './add-cocktail';
import userRouter from './user';

export default function () {
  const app = Router();

  ingredientsRouter(app);
  ingredientRouter(app);
  cocktailsRouter(app);
  cocktailRouter(app);
  addIngredientRouter(app);
  addCocktailRouter(app);
  userRouter(app);

  return app;
}