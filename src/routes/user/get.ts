import { Request, Response, Router } from 'express';
import { protectedRoute } from '../middlewares/auth';
import { IUser } from '../../types/user';
import { IResError } from '../../types/common';
import { addNewUser, getUserByEmail } from '../../db/schemas/user';

const handler = async (req: Request, res: Response<IUser | IResError>) => {
  const { email, name, picture } = req.auth.payload as unknown as IUser;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      const newUser: IUser = {
        email,
        name,
        picture,
        ingredients: [],
        favoriteCocktails: [],
      };

      await addNewUser(newUser);
      res.status(200).json(newUser);

      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error when getting user account', error);
    res.status(500).json({
      error: 'Error while getting user account',
    });
  }
};

const getUserRoute = (userRoute: Router) => {
  userRoute.get('/', protectedRoute, handler);
};

export default getUserRoute;
