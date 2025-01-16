'use client';

import React, {useState} from 'react';
import classes from './form.module.css';

const INIT_STATE = {
  field: '',
  message: ''
};

function renderChildrenWithErrorLoop(children, fieldInfo) {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    const childProps = child?.props;
    if (child?.type === 'input' && childProps?.name === fieldInfo?.field) {
      return (
        <>
          {React.cloneElement(child, null)}
          <small className={classes['error-message']}>
            {fieldInfo?.message}
          </small>
        </>
      );
    }

    if (child.type !== 'input' && Array.isArray(childProps?.children)) {
      const updatedChildren = renderChildrenWithErrorLoop(
        childProps?.children,
        fieldInfo
      );
      return React.cloneElement(child, null, updatedChildren);
    }
    return child;
  });
}

export default function Form({action, children}) {
  const [fieldInfo, setFieldInfo] = useState(INIT_STATE);

  async function handleSubmitForm(event) {
    event.preventDefault();
    try {
      const formData = new FormData(event.target);
      const actionResponse = await action(formData);
      setFieldInfo(INIT_STATE);
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
      {renderChildrenWithErrorLoop(children, fieldInfo)}
    </form>
  );
}
