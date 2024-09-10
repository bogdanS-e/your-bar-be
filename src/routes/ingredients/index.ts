import { Response, Router } from 'express';
import { getAllIngredients } from '../../db/schemas/Ingredients';
import { IIngredient } from '../../types/ingredient';
import { WithId } from 'mongodb';


export default function (app: Router) {
  const route = Router();
  app.use('/ingredients', route);

  route.get('/', async (_, res: Response<WithId<IIngredient>[]>) => {
    const ingredients = await getAllIngredients();

    res.status(200).json(ingredients);
  });

  return route;
}