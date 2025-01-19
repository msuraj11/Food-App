'use server';

import {redirect} from 'next/navigation';
import {saveMeal} from './meals';
import {getValidationWithField, getMealFormData} from './helpers';
import {revalidatePath} from 'next/cache';

export async function shareMeal(formData) {
  const meal = getMealFormData(formData);
  const {isDataIncompleteOrInvalid, field} = getValidationWithField(meal);

  if (isDataIncompleteOrInvalid) {
    return {field, message: 'Mandatory data field is missed.'};
  }
  const response = await saveMeal(meal);
  if (response) {
    return response;
  }
  revalidatePath('/meals'); // This is essential for production environment.(SSR, Next.js aggressive caching)
  redirect('/meals');
}
