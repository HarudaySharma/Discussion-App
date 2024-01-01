import React from 'react'

function Button({
    inputBtn,
    type,
    value,
    onClickFnc,
    disabled,
    className,
    children,
}) {
    return (
        inputBtn
            ?
            <input type={type} value={value} onClick={onClickFnc} disabled={disabled} className={`${className}`} />
            :
                <button type={type} value={value} onClick={onClickFnc} disabled={disabled} className={className}>
                    {value}
                    {children}
                </button>
    )
}

export default Button;