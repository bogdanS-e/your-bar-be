import { Request, Response, Router } from 'express';
import { IIngredient } from '../../types/ingredient';
import { getAllCustomIngredientsByEmail } from '../../db/schemas/custom-ingredients';
import { readJWT } from '../middlewares/auth';
import ingredients from '../../db/data/defaultIngredients.json'; 

const handler = async (req: Request, res: Response<IIngredient[]>) => {
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
