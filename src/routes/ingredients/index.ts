import { Response, Router } from 'express';
import { getAllIngredients } from '../../db/schemas/Ingredients';
import { IIngredient } from '../../types/ingredient';
import { WithId } from 'mongodb';
import { readJWT } from '../middlewares/auth';
import { getAllCustomIngredientsByEmail } from '../../db/schemas/custom-ingredients';

export default function (app: Router) {
  const route = Router();
  app.use('/ingredients', route);

  route.get('/', readJWT, async (req, res: Response<WithId<IIngredient>[]>) => {
    const ingredients = await getAllIngredients();

    if (req.auth) {
      const customIngredients = await getAllCustomIngredientsByEmail(req.auth.payload.email as string);

      res.status(200).json([...ingredients, ...customIngredients]);
      
      return;
    }

    res.status(200).json(ingredients);
  });

  return route;
}