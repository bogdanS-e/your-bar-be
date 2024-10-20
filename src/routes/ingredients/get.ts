import { Request, Response, Router } from 'express';
import { WithId } from 'mongodb';
import { IIngredient } from '../../types/ingredient';
import { getAllIngredients } from '../../db/schemas/Ingredients';
import { getAllCustomIngredientsByEmail } from '../../db/schemas/custom-ingredients';
import { readJWT } from '../middlewares/auth';

const handler = async (req: Request, res: Response<WithId<IIngredient>[]>) => {
  const ingredients = await getAllIngredients();

  if (req.auth) {
    const customIngredients = await getAllCustomIngredientsByEmail(
      req.auth.payload.email as string
    );

    res.status(200).json([...ingredients, ...customIngredients]);

    return;
  }

  res.status(200).json(ingredients);
};

const getIngredientsRoute = (ingredientsRoute: Router) => {
  ingredientsRoute.get('/', readJWT, handler);
};

export default getIngredientsRoute;
