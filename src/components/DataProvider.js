import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const useData = () => {
    return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
    const [pendingRequest, setPendingRequest] = useState([]);


    const value = {
        pendingRequest,
        setPendingRequest,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
