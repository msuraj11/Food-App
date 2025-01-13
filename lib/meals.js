import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';
import fs from 'node:fs';

const db = sql('meals.db');

export async function getMeals() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // adding a delay deliberately here.
    return db.prepare('SELECT * FROM meals').all(); // doesn't return any promise here.
  } catch (error) {
    throw error;
  }
}

export function getMeal(slug) {
  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, {lower: true});
  meal.instructions = xss(meal.instructions);

  const fileExtension = meal?.image?.name?.split('.').pop();
  const fileName = `${meal.slug}-${Date.now()}.${fileExtension}`;

  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const bufferImage = await meal.image.arrayBuffer();

  stream.write(Buffer.from(bufferImage), (error) => {
    if (error) {
      throw new Error('Saving the image failed!');
    }
  });

  meal.image = `/images/${fileName}`;

  db.prepare(
    `
    INSERT INTO meals
      (title, summary, instructions, image, creator, creator_email, slug)
    VALUES (
      @title,
      @summary,
      @instructions,
      @image,
      @creator,
      @creator_email,
      @slug
    )
  `
  ).run(meal);
}
