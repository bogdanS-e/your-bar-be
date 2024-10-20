import { Request, Response, Router } from 'express';
import { WithId } from 'mongodb';
import { ICocktail } from '../../types/cocktail';
import { IResError } from '../../types/common';
import { getCocktailBySlug } from '../../db/schemas/cocktails';

const handler = async (req: Request, res: Response<WithId<ICocktail> | IResError>) => {
  const { slug } = req.params;

  const cocktail = await getCocktailBySlug(req.params.slug);

  if (!cocktail) {
    res.status(400).json({ error: `No cocktail with slug: ${slug}` });

    return;
  }

  res.status(200).json(cocktail);
};

const getCocktailRoute = (cocktailRouter: Router) => {
  cocktailRouter.get('/:slug', handler);
};

export default getCocktailRoute;
