'use server';

import {redirect} from 'next/navigation';
import {saveMeal} from './meals';
import {getValidationWithField, getMealFormData} from './helpers';
import {revalidatePath} from 'next/cache';

export async function shareMeal(formData) {
  const meal = getMealFormData(formData);
  const errorFieldsStack = getValidationWithField(meal);

  if (errorFieldsStack.length > 0) {
    return {fields: errorFieldsStack, message: 'Please provide a valid input.'};
  }
  const titleAlreadyExist = await saveMeal(meal);
  if (titleAlreadyExist) {
    return titleAlreadyExist;
  }
  revalidatePath('/meals'); // This is essential for production environment.(SSR, Next.js aggressive caching)
  redirect('/meals');
}
