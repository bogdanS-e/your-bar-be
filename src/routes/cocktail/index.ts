import { Response, Router } from 'express';
import { WithId } from 'mongodb';
import { IResError } from '../../types/common';
import { ICocktail } from '../../types/cocktail';
import { getCocktailBySlug } from '../../db/schemas/cocktails';

export default function (app: Router) {
  const route = Router();
  app.use('/cocktail', route);

  route.get('/:slug', async (req, res: Response<WithId<ICocktail> | IResError>) => {
    const {slug} = req.params;
    
    const cocktail = await getCocktailBySlug(req.params.slug);

    if (!cocktail) {
      res.status(400).json({ error: `No cocktail with slug: ${slug}` });

      return;
    }

    res.status(200).json(cocktail);
  });

  return route;
}