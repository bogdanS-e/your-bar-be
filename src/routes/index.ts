import { Router } from 'express';

import userRoute from './user';
import ingredientsRoute from './ingredients';
import ingredientRoute from './ingredient';
import cocktailsRoute from './cocktails';
import cocktailRoute from './cocktail';

const indexRoute = () => {
  const app = Router();

  ingredientsRoute(app);
  ingredientRoute(app);
  cocktailsRoute(app);
  cocktailRoute(app);
  userRoute(app);

  return app;
};

export default indexRoute;
