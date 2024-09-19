import { Response, Router } from 'express';
import { getIngredientById } from '../../db/schemas/Ingredients';
import { ObjectId, WithId } from 'mongodb';
import { IResError } from '../../types/common';
import { ICocktail } from '../../types/cocktail';

export default function (app: Router) {
  const route = Router();
  app.use('/cocktail', route);

  route.get('/:id', async (req, res: Response<WithId<ICocktail> | IResError>) => {
    const {id} = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const cocktail = await getIngredientById(req.params.id);

    if (!cocktail) {
      res.status(400).json({ error: `No cocktail with id ${id}` });

      return;
    }

    res.status(200).json(cocktail);
  });

  return route;
}