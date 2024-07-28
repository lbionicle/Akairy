
const AppNumberInput = ({
    label,
    name,
    value,
    onChange,
    minLength,
    maxLength,
    min,
    max,
    step,
    placeholder,
    userStyle,
    required
  }) => {

    const blockInvalidChar = (e) => {
        e.preventDefault()
        ['e', 'E', '+', '-'].includes(e.key)
        e.target.value = +e.target.value.replace(/^0+/, '')
    };

    return (
        <>
            <label htmlFor={name}>{label} <span className="text-danger">*</span></label>
            <input
                type="number"
                id={name}
                name={name}
                value={value}
                onKeyDown={blockInvalidChar}
                onChange={onChange}
                min={min}
                max={max}
                minLength={minLength}
                maxLength={maxLength}
                step={step}
                placeholder={placeholder}
                className={`form-control ${userStyle}`}
                required={required}
            />
        </>
    )
}

export default AppNumberInput;