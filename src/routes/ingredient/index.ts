import { Response, Router } from 'express';
import { getIngredientById } from '../../db/schemas/Ingredients';
import { IIngredient } from '../../types/ingredient';
import { ObjectId, WithId } from 'mongodb';
import { IResError } from '../../types/common';

export default function (app: Router) {
  const route = Router();
  app.use('/ingredient', route);

  route.get('/:id', async (req, res: Response<WithId<IIngredient> | IResError>) => {
    const {id} = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const ingredient = await getIngredientById(req.params.id);

    if (!ingredient) {
      res.status(400).json({ error: `No ingredient with id ${id}` });

      return;
    }

    res.status(200).json(ingredient);
  });

  return route;
}