'use server';

import {redirect} from 'next/navigation';
import {saveMeal} from './meals';

function isInvalidInputField(fieldData, field) {
  switch (typeof fieldData) {
    case 'string':
      const isEmptyField = !fieldData || fieldData?.trim().length === 0;
      if (field === 'creator_email') {
        return !isEmptyField && !fieldData.includes('@');
      }
      return isEmptyField;

    case 'object':
      return fieldData?.size === 0;

    default:
      return;
  }
}

export async function shareMeal(formData) {
  const meal = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    instructions: formData.get('instructions'),
    image: formData.get('image'),
    creator: formData.get('name'),
    creator_email: formData.get('email')
  };

  let isDataIncompleteOrInvalid;
  for (const fieldKey in meal) {
    isDataIncompleteOrInvalid = isInvalidInputField(meal[fieldKey], fieldKey);
    if (isInvalidInputField(meal[fieldKey], fieldKey)) {
      break;
    }
  }

  if (isDataIncompleteOrInvalid) {
    throw Error('Failed to submit form');
  }
  await saveMeal(meal);
  redirect('/meals');
}
