import { Router } from 'express';

import addIngredientRoute from './add';
import editIngredientRoute from './edit';
import deleteIngredientRoute from './delete';
import getIngredientRoute from './get';

const ingredientRoute = (app: Router) => {
  const route = Router();

  addIngredientRoute(route);
  editIngredientRoute(route);
  deleteIngredientRoute(route);
  getIngredientRoute(route);

  app.use('/ingredient', route);

  return route;
};

export default ingredientRoute;
