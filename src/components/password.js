import { forwardRef, useState } from 'react';
import { FaBeer } from "react-icons/fa";
import {IoEye, IoEyeOffSharp} from "react-icons/io5";

const Password = forwardRef(({ placeholder, className, ...rest }, ref) => {
  const [show, setShow] = useState(false);

  const toggle = (e) => {
    setShow((prev) => !prev);
  };

  return (
    <div className='relative w-full'>
      <span className='absolute inset-y-0 right-2 flex items-center pl-2'>
        <label role='button' className='p-1 focus:outline-none focus:shadow-outline text-gray-600' onClick={toggle}>
          {show ? <IoEyeOffSharp width={20} height={20} /> : <IoEye width={20} height={20} />}
        </label>
      </span>
      <input
        type={show ? 'text' : 'password'}
        ref={ref}
        placeholder={placeholder}
        className={`${className || ''} border-1 rounded-lg w-full h-12 px-4`}
        {...rest}
      />
    </div>
  );
});

export default Password;
