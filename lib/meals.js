import sql from 'better-sqlite3';

const db = sql('meals.db');

export async function getMeals() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // adding a delay deliberately here.
    return db.prepare('SELECT * FROM meals').all(); // doesn't return any promise here.
  } catch (error) {
    throw error;
  }
}
