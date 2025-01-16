'use client';

import {useState} from 'react';
import classes from './form.module.css';

const INIT_STATE = {
  field: '',
  message: ''
};

function ErrorMessage({message}) {
  return <p className={classes['error-message']}>{message}</p>;
}

export default function Form({action, children}) {
  const [fieldInfo, setFieldInfo] = useState(INIT_STATE);

  async function handleSubmitForm(event) {
    event.preventDefault();
    try {
      const formData = new FormData(event.target);
      const actionResponse = await action(formData);

      if (typeof actionResponse === 'object') {
        const {field, message} = actionResponse;
        const error = new Error(message);
        error.field = field;
        throw error;
      } else {
        throw new Error(actionResponse);
      }
    } catch (error) {
      const {field, message} = error;
      setFieldInfo((prevState) => ({...prevState, field, message}));
    }
  }

  // onSubmit is added because of existing issue in Next.js and React v19, resetting form.
  // Ref: https://github.com/edmundhung/conform/issues/681
  return (
    <form className={classes.form} onSubmit={handleSubmitForm}>
      {/* Manage field level errors and remove below code, once fix available. */}
      {fieldInfo.message && <ErrorMessage message={fieldInfo.message} />}
      {children}
    </form>
  );
}
