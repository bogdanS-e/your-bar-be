import { Router } from 'express';
import addCocktailRoute from './add';
import editCocktailRoute from './edit';
import getCocktailRoute from './get';

const cocktailRoute = (app: Router) => {
  const route = Router();

  addCocktailRoute(route);
  editCocktailRoute(route);
  getCocktailRoute(route);

  app.use('/cocktail', route);

  return route;
};

export default cocktailRoute;
