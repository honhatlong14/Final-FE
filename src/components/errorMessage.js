import { FaBeer } from "react-icons/fa";
import {CiWarning} from "react-icons/ci";

const ErrorMessageCustom = ({message}) => {
    return (
      <div
        className=" text-red-900 w-fit px-2"
        role="alert"
      >
        <span className="flex w-fit items-center gap-1 "><CiWarning className="w-5 h-5" />{message}</span>
      </div>
    );
}

export default ErrorMessageCustom;