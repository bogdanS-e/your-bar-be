import { Router } from 'express';
import getCocktailsRoute from './get';

const cocktailsRoute = (app: Router) => {
  const route = Router();

  getCocktailsRoute(route);

  app.use('/cocktails', route);

  return route;
};

export default cocktailsRoute;
