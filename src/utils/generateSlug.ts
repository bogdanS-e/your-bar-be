import { Collection, Filter } from "mongodb";
import slugify from "slugify";
import { ICocktail } from "../types/cocktail";
import { IIngredient } from "../types/ingredient";

const generateUniqueSlug = async <T extends ICocktail | IIngredient >(name: string, collection: Collection<T>) => {
  const baseSlug = slugify(name, { lower: true, strict: true, replacement: '-' });
  let slug = baseSlug;

  // Check for uniqueness
  let count = 1;
  while (await collection.findOne({ slug } as Filter<T>)) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
}

export default generateUniqueSlug;