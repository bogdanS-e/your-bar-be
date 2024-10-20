import { Response, Router } from 'express';
import { getIngredientBySlug } from '../../db/schemas/Ingredients';
import { IIngredient } from '../../types/ingredient';
import { WithId } from 'mongodb';
import { IResError } from '../../types/common';

import addIngredientRoute from './add';
import editIngredientRoute from './edit';
import deleteIngredientRoute from './delete';

export default function (app: Router) {
  const route = Router();

  addIngredientRoute(route);
  editIngredientRoute(route);
  deleteIngredientRoute(route);

  route.get('/:slug', async (req, res: Response<WithId<IIngredient> | IResError>) => {
    const { slug } = req.params;

    const ingredient = await getIngredientBySlug(req.params.slug);

    if (!ingredient) {
      res.status(400).json({ error: `No ingredient with slug: ${slug}` });

      return;
    }

    res.status(200).json(ingredient);
  });

  app.use('/ingredient', route);

  return route;
}
