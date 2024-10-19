import { Response, Router } from "express";
import { IngredientTag } from "../../types/ingredient";
import { protectedRoute } from "../middlewares/auth";
import multerUpload from "../middlewares/multer";
import validateIngredient from "../middlewares/validateIngredient";
import { IResError } from "../../types/common";
import { uploadImage } from "../../utils/cloudinary";
import { addNewCustomIngredient } from "../../db/schemas/custom-ingredients";

export interface IAddIngredientReq {
  name: string;
  description: string;
  tags: string; //pass string as Form data json array
}

interface IAddIngredientRes {
  name: string;
  description: string;
  tags: IngredientTag[];
  image: string | null;
}

const addIngredientRoute = (ingredientRouter: Router) => {
  ingredientRouter.post('/add', protectedRoute, multerUpload.single('image'), validateIngredient, async (req, res: Response<IAddIngredientRes | IResError>) => {
    const { name, description, tags } = req.body as IAddIngredientReq;
    let imageUrl = null;

    try {
      if (req.file) {
        imageUrl = await uploadImage(req.file, 'custom-ingredients');
        console.log('Uploaded image URL:', imageUrl); // Log URL to debug
      }

      const ingredient = {
        name,
        description,
        tags: JSON.parse(tags).sort((a, b) => a - b) as IngredientTag[], // Parse tags since they are sent as JSON
        image: imageUrl,
      };

      await addNewCustomIngredient(
        {
          nameEn: ingredient.name,
          descriptionEn: ingredient.description,
          tags: ingredient.tags,
          image: imageUrl,
        },
        req.auth.payload.email as string
      );

      res.status(201).json(ingredient);
    } catch (error) {
      console.error('Error uploading image', error);
      res.status(500).json({
        error: 'Error while adding new ingredient',
      });
    }
  });
}

export default addIngredientRoute