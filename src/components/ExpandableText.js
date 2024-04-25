import {useState} from "react";

const ExpandableText = ({text, maxLength}) => {
    const [expanded, setExpanded] = useState(false);

    const toggleText = () => {
        setExpanded(!expanded);
    };

    const displayText = expanded ? text : text.slice(0, maxLength);

    return (<div>
        {text.length > maxLength ? <p>{displayText} ...</p> : <p>{displayText}</p>}

        {text.length > maxLength && (
            <span className='w-full my-3 mx-auto hover:cursor-pointer hover:font-bold' onClick={toggleText}>
                {expanded ? 'Read Less' : 'Read More'}
            </span>)}
    </div>);
}

export default ExpandableText