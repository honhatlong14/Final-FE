import PropsType from 'prop-types';
import { forwardRef } from 'react';

const InputField = forwardRef(({ type, placeholder, disabled, className, ...rest }, ref) => {
    return (
        <input
            type={type}
            ref={ref}
            placeholder={placeholder}
            className={`bg-white border-1 rounded-lg w-full h-12 px-4 ${className || ''}`}
            {...rest}
            disabled={disabled || false}
        />
    );
});

InputField.propsType = {
    type: PropsType.oneOf(['text', 'password', 'email', 'number']),
    placeholder: PropsType.string,
};

export default InputField;
