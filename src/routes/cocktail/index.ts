import { Response, Router } from 'express';
import { ObjectId, WithId } from 'mongodb';
import { IResError } from '../../types/common';
import { ICocktail } from '../../types/cocktail';
import { getCocktailById } from '../../db/schemas/cocktails';

export default function (app: Router) {
  const route = Router();
  app.use('/cocktail', route);

  route.get('/:id', async (req, res: Response<WithId<ICocktail> | IResError>) => {
    const {id} = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const cocktail = await getCocktailById(req.params.id);

    if (!cocktail) {
      res.status(400).json({ error: `No cocktail with id ${id}` });

      return;
    }

    res.status(200).json(cocktail);
  });

  return route;
}