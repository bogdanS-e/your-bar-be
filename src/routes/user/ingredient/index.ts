import { Router } from 'express';
import addUserIngredientRoute from './add';
import deleteUserIngredientRoute from './delete';

const userIngredientRoute = (app: Router) => {
  const route = Router();

  addUserIngredientRoute(route);
  deleteUserIngredientRoute(route);

  app.use('/ingredient', route);

  return route;
};

export default userIngredientRoute;
