import PropsType from 'prop-types';

const Form = ({title, children, className, ...rest }) => {
  return (
    <div className={`rounded-lg shadow-[0_0px_4px_rgba(0,0,0,0.25)] p-10 w-full backdrop-blur-md ${className || ''}`}>
      <form className='flex flex-col space-y-4' {...rest}>
        <h1 className='font-bold text-2xl text-gray-700 w-5/6 text-center'>{title}</h1>
        {children}
      </form>
    </div>
  );
};

Form.propsType = {
  children: PropsType.element,
  title: PropsType.string,
};

export default Form;
