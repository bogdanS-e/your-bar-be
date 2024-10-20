import { Router } from 'express';

import addFavoriteCocktailRoute from './add';
import deleteFavoriteCocktailRoute from './delete';

const userFavoriteCocktailRoute = (app: Router) => {
  const route = Router();

  addFavoriteCocktailRoute(route);
  deleteFavoriteCocktailRoute(route);

  app.use('/favorite-cocktail', route);

  return route;
};

export default userFavoriteCocktailRoute;
