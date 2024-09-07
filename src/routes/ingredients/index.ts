import { Router } from 'express';
import { addNewIngredient, getAllIngredients } from '../../db/schemas/Ingredients';
import path from 'path';

import addIngredient from './add-ingredient';


export default function (app: Router) {
  const route = Router();

  app.get('/ingredients', async (req, res) => {
    const a = await getAllIngredients();
    console.log(a);


    res.sendFile(path.join(__dirname, '/index.html'));
  });

  addIngredient(app);

  return route;
}