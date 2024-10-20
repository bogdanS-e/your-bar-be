import { Router } from 'express';

import userIngredientRoute from './ingredient';
import userFavoriteCocktailRoute from './favorite-cocktail';
import getUserRoute from './get';

const userRoute = (app: Router) => {
  const route = Router();

  userIngredientRoute(route);
  userFavoriteCocktailRoute(route);
  getUserRoute(route);

  app.use('/user', route);

  return route;
};

export default userRoute;
