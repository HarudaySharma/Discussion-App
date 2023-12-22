import React from 'react'

function Button({
    inputBtn,
    type,
    value,
    onClickFnc,
    className,
}) {
    return (
        inputBtn
            ?
            <input type={type} value={value} onClick={onClickFnc} className={`bg-red-500 text-white ${className}`} />
            :
            <button type={type} value={value} onClick={onClickFnc} className={className}>
                {value}
            </button>
    )
}

export default Button;