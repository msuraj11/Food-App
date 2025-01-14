'use client';

import {useActionState} from 'react';
import classes from './form.module.css';
import {getMealFormData, getValidationWithField} from '@/lib/helpers';

const INIT_STATE = {
  field: '',
  message: ''
};

function ErrorMessage({message}) {
  return <p className={classes['error-message']}>{message}</p>;
}

export default function Form({action, children}) {
  // TODO: Remove this useActionState if onSubmit is given priority, due to which error message state
  // is ignored. Instead prefer useState and perform server action.
  const [state, formAction] = useActionState(action, INIT_STATE);

  function handleSubmitForm(event) {
    const formData = new FormData(event.target);
    const meal = getMealFormData(formData);
    const {isDataIncompleteOrInvalid} = getValidationWithField(meal);

    if (isDataIncompleteOrInvalid) {
      event.preventDefault();
    }
  }

  // onSubmit is added because of existing issue in Next.js and React v19, resetting form.
  // Ref: https://github.com/edmundhung/conform/issues/681
  return (
    <form
      className={classes.form}
      action={formAction}
      onSubmit={handleSubmitForm}
    >
      {children}
      {/* Manage field level errors and remove below code, once fix available. */}
      {state.field && <ErrorMessage message={state.message} />}
    </form>
  );
}
