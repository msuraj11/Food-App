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

export function getMealFormData(formData) {
  return {
    title: formData.get('title'),
    summary: formData.get('summary'),
    instructions: formData.get('instructions'),
    image: formData.get('image'),
    creator: formData.get('name'),
    creator_email: formData.get('email')
  };
}

export function getValidationWithField(meal) {
  let isDataIncompleteOrInvalid, field;
  for (const fieldKey in meal) {
    isDataIncompleteOrInvalid = isInvalidInputField(meal[fieldKey], fieldKey);
    if (isDataIncompleteOrInvalid) {
      field = fieldKey?.includes('creator')
        ? fieldKey?.includes('email')
          ? 'email'
          : 'name'
        : fieldKey;
      break;
    }
  }
  return {
    isDataIncompleteOrInvalid,
    field
  };
}
