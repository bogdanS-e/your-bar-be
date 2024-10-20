import { Request, Response, Router } from 'express';
import { protectedRoute } from '../middlewares/auth';
import { IResError } from '../../types/common';
import { removeEmailFromCustomIngredient } from '../../db/schemas/custom-ingredients';
import { deleteIngredientFromUser } from '../../db/schemas/user';

const handler = async (req: Request, res: Response<IResError | string>) => {
  const { ingredientId } = req.params;

  try {
    await removeEmailFromCustomIngredient(req.auth.payload.email as string, ingredientId);
    await deleteIngredientFromUser(req.auth.payload.email as string, ingredientId);

    res.status(200).json('Deleted');
  } catch (error) {
    console.error('Error while deleting ingredient', error);
    res.status(500).json({
      error: 'Error while deleting ingredient',
    });
  }
};

const deleteIngredientRoute = (ingredientRouter: Router) => {
  ingredientRouter.delete(`/delete/:ingredientId`, protectedRoute, handler);
};

export default deleteIngredientRoute;
