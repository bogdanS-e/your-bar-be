import { Router } from 'express';

import ingredientsRouter from './ingredients';

export default function () {
  const app = Router();

  ingredientsRouter(app);

  return app;
}