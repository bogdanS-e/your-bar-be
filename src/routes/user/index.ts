import { Request, Response, Router } from 'express';

import { addNewUser, getUserByEmail } from '../../db/schemas/user';
import { IResError } from '../../types/common';
import { protectedRoute } from '../middlewares/auth';


export default function (app: Router) {
  const route = Router();
  app.use('/user', route);

  route.get('/', protectedRoute, async (req: Request, res: Response<IUser | IResError>) => {
    const { email, name, picture } = req.auth.payload as unknown as IUser;

    try {
      const user = await getUserByEmail(email);

      if (!user) {
        const newUser: IUser = {
          email,
          name,
          picture
        }

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
  });

  return route;
}