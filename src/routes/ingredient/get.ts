import { Request, Response, Router } from 'express';
import { WithId } from 'mongodb';
import { IResError } from '../../types/common';
import { getIngredientBySlug } from '../../db/schemas/Ingredients';
import { IIngredient } from '../../types/ingredient';

const handler = async (req: Request, res: Response<WithId<IIngredient> | IResError>) => {
  const { slug } = req.params;

  const ingredient = await getIngredientBySlug(req.params.slug);

  if (!ingredient) {
    res.status(400).json({ error: `No ingredient with slug: ${slug}` });

    return;
  }

  res.status(200).json(ingredient);
};

const getIngredientRoute = (ingredientRoute: Router) => {
  ingredientRoute.get('/:slug', handler);
};

export default getIngredientRoute;
