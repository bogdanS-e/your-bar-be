import { Response, Router } from 'express';
import { WithId } from 'mongodb';
import { ICocktail } from '../../types/cocktail';
import { getAllCocktails } from '../../db/schemas/cocktails';

export default function (app: Router) {
  const route = Router();
  app.use('/cocktails', route);

  route.get('/', async (_, res: Response<WithId<ICocktail>[]>) => {
    const ingredients = await getAllCocktails();

    res.status(200).json(ingredients);
  });

  return route;
}
