import React from 'react'

function InputContainer({
  type,
  value,
  defaultValue,
  labelValue,
  labelAdd,
  placeholder,
  name,
  id,
  disabled,
  required,
  onChangeFnc,
  onFocusFnc,
  onBlurFnc,
  fieldSetClassnames,
  labelClassnames,
  inputClassNames,
  readOnly,
  children,
}) {
  return (
    <fieldset className={`${fieldSetClassnames}`}>
      {labelAdd && <label htmlFor={id} className={`text-sm ${labelClassnames}`}>{labelValue}</label>}
      <input
        defaultValue={defaultValue}
        readOnly={readOnly}
        type={type}
        value={value}
        name={name}
        id={id}
        onBlur={onBlurFnc}
        onFocus={onFocusFnc}
        onChange={onChangeFnc}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`${inputClassNames}`}
      />
      {children}
    </fieldset>
  )
}

export default InputContainer