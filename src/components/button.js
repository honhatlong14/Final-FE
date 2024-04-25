import PropsType from 'prop-types';

const Button = ({ type, title, role, children, icon: Icon, className, ...rest }) => {
  const typeCheck = () => {
    switch (type) {
      case 'primary':
        return 'bg-[#088DCD] hover:opacity-75';
      case 'secondary':
        return 'bg-gray-400 hover:bg-gray-600';
      case 'warning':
        return 'bg-yellow-400 hover:bg-yellow-600';
      case 'danger':
        return 'bg-red-400 hover:bg-red-600';
      case 'info':
        return 'bg-blue-300 hover:bg-blue-500';
      case 'success':
        return 'bg-green-400 hover:bg-green-600';
      default:
        return 'bg-white';
    }
  };

  return (
    <>
      <button
        className={`${typeCheck()} ${
          rest.disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        } flex gap-1 sm:gap-2 items-center justify-center h-fit text-white rounded-md font-semibold px-[10px] py-[7px] sm:px-4 sm:py-3 w-full ${
          className || ''
        }`}
        type={role}
        {...rest}
      >
        <label className={`${rest.disabled ? 'cursor-not-allowed' : 'cursor-pointer'} hidden sm:inline-block`}>
          {title}
        </label>
        {Icon && <Icon className='h-5 w-5' />}
      </button>
    </>
  );
};

Button.propsType = {
  type: PropsType.oneOf(['primary', 'secondary', 'warning', 'danger', 'info', 'success']),
  title: PropsType.string,
  role: PropsType.oneOf(['button', 'submit']),
};

export default Button;
