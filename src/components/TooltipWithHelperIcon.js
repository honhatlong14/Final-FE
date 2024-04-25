import { Tooltip, Typography } from "@material-tailwind/react";
import {MdFeedback} from "react-icons/md";


export function TooltipWithHelperIcon() {
    return (
        <Tooltip
            content={
                <div className="w-80">
                    <Typography color="white" className="font-medium">
                        Let's say somethings ~~~
                    </Typography>
                    <Typography
                        variant="small"
                        color="white"
                        className="font-normal opacity-80"
                    >
                       Feedback for us
                    </Typography>
                </div>
            }
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                className="h-6 w-6 mt-1 cursor-pointer text-blue-gray-500"
            >
                <MdFeedback />
            </svg>
        </Tooltip>
    );
}