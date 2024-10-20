import { Request, Response, Router } from 'express';
import { protectedRoute } from '../../middlewares/auth';
import { IResError } from '../../../types/common';
import { IUser } from '../../../types/user';
import { ObjectId } from 'mongodb';
import { deleteFavoriteCocktailFromUser } from '../../../db/schemas/user';

const handler = async (req: Request, res: Response<string | IResError>) => {
  const { email } = req.auth.payload as unknown as IUser;
  const { cocktailId } = req.params;

  // Validate if ingredientId is a valid ObjectId
  if (!ObjectId.isValid(cocktailId)) {
    return res.status(400).json({ error: 'Invalid ingredient ID format.' });
  }

  try {
    await deleteFavoriteCocktailFromUser(email, cocktailId);

    res.status(200).json(cocktailId);
  } catch (error) {
    console.error('Error when deleting ingredient from user', error);
    res.status(500).json({
      error: 'Error when deleting ingredient from user',
    });
  }
};

const deleteFavoriteCocktailRoute = (favoriteCocktailRoute: Router) => {
  favoriteCocktailRoute.delete('/delete/:cocktailId', protectedRoute, handler);
};

export default deleteFavoriteCocktailRoute;
