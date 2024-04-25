import {useState} from "react";

export const useReducer = (reducer, initValue) =>{
    const [state, setState] = useState(initValue);

    const dispatch = (action) =>{
        // newState = với cái gì?? hàm reducer hay sao?
        const newState = reducer(state, action);

        setState(newState);
    }

    // return như này là sao
    return [state, dispatch];
}