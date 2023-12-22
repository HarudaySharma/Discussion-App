import React from 'react'

function InputContainer({
    type,
    value,
    labelValue,
    name,
    id,
    disabled,
    required,
    onChangeFnc,
    className
}) {
  return (
    <fieldset className='flex flex-col gap-4 items-start'>
        <label htmlFor={id} className='uppercase'>{labelValue}</label>
        <input type={type} value={value} name={name} id={id} onChange={onChangeFnc} disabled={disabled} required={required}  className={className}/>
    </fieldset>
  )
}

export default InputContainer