import { Response, Router } from 'express';
import { getAllIngredients } from '../../db/schemas/Ingredients';
import { IIngredient } from '../../types/ingredient';
import { WithId } from 'mongodb';

import { auth } from 'express-oauth2-jwt-bearer';

const jwtCheck = auth({
  audience: 'https://hello-world.example.com',
  issuerBaseURL: 'https://dev-8j9ru6to.us.auth0.com/',
  tokenSigningAlg: 'RS256',
  authRequired: false,
});

export default function (app: Router) {
  const route = Router();
  app.use('/ingredients', route);

  route.get('/', jwtCheck, async (req, res: Response<WithId<IIngredient>[]>) => {
    if (req.auth) {
      console.log(req.auth.payload);
    }
    
    const ingredients = await getAllIngredients();

    res.status(200).json(ingredients);
  });

  return route;
}