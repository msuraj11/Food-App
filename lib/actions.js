'use server';

import {redirect} from 'next/navigation';
import {saveMeal} from './meals';
import {getValidationWithField, getMealFormData} from './helpers';

export async function shareMeal(prevState, formData) {
  const meal = getMealFormData(formData);
  const {isDataIncompleteOrInvalid, field} = getValidationWithField(meal);

  if (isDataIncompleteOrInvalid) {
    return {
      field,
      message: `Invalid ${
        field === 'image' ? 'Image' : 'Input'
      } or Mandatory field is not updated.`
    };
  }
  await saveMeal(meal);
  redirect('/meals');
}
