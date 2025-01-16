'use server';

import {redirect} from 'next/navigation';
import {saveMeal} from './meals';
import {getValidationWithField, getMealFormData} from './helpers';

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
  redirect('/meals');
}
