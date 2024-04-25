import PropsType from "prop-types";
import { forwardRef } from "react";

const TextAreaField = forwardRef(({ rows, placeholder, ...rest }, ref) => {
  return <textarea ref={ref} rows={rows} placeholder={placeholder} className="border-1 rounded-lg w-full h-auto px-4" {...rest}></textarea>;
})

TextAreaField.propsType = {
  placeholder: PropsType.string,
  rows: PropsType.string.isRequired,
};

export default TextAreaField;
