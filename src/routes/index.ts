import { Router } from 'express';

import ingredientsRouter from './ingredients';
import addIngredientRouter from './add-ingredient.ts';

export default function () {
  const app = Router();

  ingredientsRouter(app);
  addIngredientRouter(app);

  return app;
}