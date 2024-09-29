import { Response, Router } from 'express';
import { getIngredientBySlug } from '../../db/schemas/Ingredients';
import { IIngredient } from '../../types/ingredient';
import { WithId } from 'mongodb';
import { IResError } from '../../types/common';

export default function (app: Router) {
  const route = Router();
  app.use('/ingredient', route);

  route.get('/:slug', async (req, res: Response<WithId<IIngredient> | IResError>) => {
    const {slug} = req.params;
    
    const ingredient = await getIngredientBySlug(req.params.slug);

    if (!ingredient) {
      res.status(400).json({ error: `No ingredient with slug: ${slug}` });

      return;
    }

    res.status(200).json(ingredient);
  });

  return route;
}