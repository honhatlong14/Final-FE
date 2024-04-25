import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const SelectOption = forwardRef(({ listData, defaultValue, className, ...rest }, ref) => {
    return (
        <select {...rest} ref={ref} className={`border-1 rounded-lg w-full h-12 px-4 ${className ?? ''}`}>
            {listData.length &&
                listData.map((item, index) => (
                    <option value={item.value} key={index}>
                        {item.name}
                    </option>
                ))}
        </select>
    );
});

SelectOption.propsType = {
    listData: PropTypes.array,
    defaultValue: PropTypes.oneOf(['string', 'value', 'object']),
};

export default SelectOption;
