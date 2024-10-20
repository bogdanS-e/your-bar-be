import { Router } from 'express';

import ingredientsRouter from './ingredients';
import ingredientRouter from './ingredient';
import cocktailsRouter from './cocktails';
import cocktailRouter from './cocktail';
import userRouter from './user';

export default function () {
  const app = Router();

  ingredientsRouter(app);
  ingredientRouter(app);
  cocktailsRouter(app);
  cocktailRouter(app);
  userRouter(app);

  return app;
}
