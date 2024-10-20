import { Router } from 'express';
import getIngredientsRoute from './get';

const ingredientsRoute = (app: Router) => {
  const route = Router();

  getIngredientsRoute(route);

  app.use('/ingredients', route);

  return route;
};

export default ingredientsRoute;
