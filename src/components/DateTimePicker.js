import PropsType from 'prop-types';
import { forwardRef } from 'react';

const DateTimePicker = forwardRef(({ onChange, ...rest }, ref) => {
    return (
        <input type='date' ref={ref} onChange={onChange} className='border-1 rounded-lg w-full h-12 px-4' {...rest} />
    );
});

DateTimePicker.propsType = {
    defaultValue: PropsType.string,
    onChange: PropsType.func,
};

export default DateTimePicker;
