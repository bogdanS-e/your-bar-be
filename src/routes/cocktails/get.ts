import { Response, Router } from 'express';
import { WithId } from 'mongodb';
import { ICocktail } from '../../types/cocktail';
import { getAllCocktails } from '../../db/schemas/cocktails';

const handler = async (_, res: Response<WithId<ICocktail>[]>) => {
  const cocktails = await getAllCocktails();

  res.status(200).json(cocktails);
};

const getCocktailsRoute = (cocktailsRouter: Router) => {
  cocktailsRouter.get('/', handler);
};

export default getCocktailsRoute;
