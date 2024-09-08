import { Response, Router } from 'express';
import { getAllIngredients } from '../../db/schemas/Ingredients';
import { TMongoIngredient } from '../../types/ingredient';


export default function (app: Router) {
  const route = Router();
  app.use('/ingredients', route);

  route.get('/', async (_, res: Response<TMongoIngredient[]>) => {
    const ingredients = await getAllIngredients();

    res.status(200).json(ingredients);
  });

  return route;
}