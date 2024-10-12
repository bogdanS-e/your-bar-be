import { Request, Response, Router } from "express";
import { protectedRoute } from "../../middlewares/auth";
import { IResError } from "../../../types/common";
import { ObjectId } from "mongodb";
import { addFavoriteCocktailToUser, deleteFavoriteCocktailFromUser } from "../../../db/schemas/user";
import { IUser } from "../../../types/user";

export default function (app: Router) {
  const route = Router();
  app.use('/favorite-cocktail', route);

  route.post('/add/:cocktailId', protectedRoute, async (req: Request, res: Response<string | IResError>) => {
    const { email } = req.auth.payload as unknown as IUser;
    const { cocktailId } = req.params;

    // Validate if ingredientId is a valid ObjectId
    if (!ObjectId.isValid(cocktailId)) {
      return res.status(400).json({ error: 'Invalid cocktail ID format.' });
    }

    try {
      await addFavoriteCocktailToUser(email, cocktailId);

      res.status(200).json(cocktailId);
    } catch (error) {
      console.error('Error when adding ingredient to user', error);
      res.status(500).json({
        error: 'Error when adding ingredient to user',
      });
    }
  });

  route.delete('/delete/:cocktailId', protectedRoute, async (req: Request, res: Response<string | IResError>) => {
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
  });

  return route;
}