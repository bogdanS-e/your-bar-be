import { Request, Response, Router } from "express";
import { protectedRoute } from "../../middlewares/auth";
import { IResError } from "../../../types/common";
import { ObjectId } from "mongodb";
import { addIngredientToUser, deleteIngredientFromUser } from "../../../db/schemas/user";
import { IUser } from "../../../types/user";

export default function (app: Router) {
  const route = Router();
  app.use('/ingredient', route);

  route.post('/add/:ingredientId', protectedRoute, async (req: Request, res: Response<string | IResError>) => {
    const { email } = req.auth.payload as unknown as IUser;
    const { ingredientId } = req.params;
    
    // Validate if ingredientId is a valid ObjectId
    if (!ObjectId.isValid(ingredientId)) {
      return res.status(400).json({ error: 'Invalid ingredient ID format.' });
    }

    try {
      await addIngredientToUser(email, ingredientId);

      res.status(200).json(ingredientId);
    } catch (error) {
      console.error('Error when adding ingredient to user', error);
      res.status(500).json({
        error: 'Error when adding ingredient to user',
      });
    }
  });

  route.delete('/delete/:ingredientId', protectedRoute, async (req: Request, res: Response<string | IResError>) => {
    const { email } = req.auth.payload as unknown as IUser;
    const { ingredientId } = req.params;

    // Validate if ingredientId is a valid ObjectId
    if (!ObjectId.isValid(ingredientId)) {
      return res.status(400).json({ error: 'Invalid ingredient ID format.' });
    }

    try {
      await deleteIngredientFromUser(email, ingredientId);

      res.status(200).json(ingredientId);
    } catch (error) {
      console.error('Error when deleting ingredient from user', error);
      res.status(500).json({
        error: 'Error when deleting ingredient from user',
      });
    }
  });

  return route;
}