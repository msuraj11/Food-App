'use client';

import React, {useState} from 'react';
import classes from './form.module.css';

const INIT_STATE = {
  fields: [],
  message: ''
};

function renderChildrenWithErrorLoop(children, fieldInfo) {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    const childProps = child?.props;
    if (
      ['input', 'textarea'].includes(child?.type) &&
      [...fieldInfo?.fields].includes(childProps?.name)
    ) {
      return (
        <>
          {React.cloneElement(child, childProps)}
          <small className={classes['error-message']}>
            {fieldInfo?.message + ' : ' + childProps?.name}
          </small>
        </>
      );
    }

    if (
      [...fieldInfo?.fields].includes('image') &&
      child?.type === 'p' &&
      childProps.className?.includes('actions')
    ) {
      return (
        <>
          <small className={classes['error-message']}>{fieldInfo?.message + ' : image.'}</small>
          {React.cloneElement(child, childProps)}
        </>
      );
    }

    if (child.type !== 'input' && Array.isArray(childProps?.children)) {
      const updatedChildren = renderChildrenWithErrorLoop(childProps?.children, fieldInfo);
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
        const {fields, message} = actionResponse;
        const error = new Error(message);
        error.fields = fields;
        throw error;
      } else {
        throw new Error(actionResponse);
      }
    } catch (error) {
      const {fields, message} = error;
      console.log(fields, message, error);
      setFieldInfo((prevState) => ({...prevState, fields, message}));
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
