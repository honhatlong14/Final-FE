import axios from 'axios';
import {ca} from "date-fns/locale";

const apiInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_API,
    validateStatus: (status) => status <= 500,
});

apiInstance.interceptors.request.use((request) => {
    return request;
});

export const tokenRequestInterceptor = async (apiCall, refreshToken) => {
    const {status, data} = await apiCall();
    if (status === 401) {
        await refreshToken();
        return await apiCall();
    } else {
        return {status, data};
    }
};

// Authenticate
export const login = (formData) => apiInstance.post(
    '/Users/authenticate',
    {...formData},
    {withCredentials: true}
);

export const loginGoogle = (tokenId) => apiInstance.post(
    '/Users/authenticate-google',
    {tokenId},
    {withCredentials: true}
);



export const register = (formData, token) =>
    apiInstance.post('/Users/register',
        formData,
        {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`,
            'content-type': 'multipart/form-data',
        },
    });

//  tại sap lúc thì truyền Object lúc thì truyền 2 param
export const logout = ({refreshToken, token}) => {
    return apiInstance.post(
        '/Users/revoke-token',
        {refreshToken},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

export const refreshToken = (token) => {
    return apiInstance.post(
        '/Users/refresh-token',
        {},
        {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
    );
}


export const forgotPassword = (formData, token) =>
    apiInstance.post(
        `/Users/forgot-password`,
        {...formData},
        {
            headers: {Authorization: `Bearer ${token}`},
        }
    );

export const validateResetToken = (formData, token) =>
    apiInstance.post(
        `/Users/validate-reset-token`,
        {...formData},
        {
            headers: {Authorization: `Bearer ${token}`},
        }
    );

export const resetPassword = (formData, token) =>
    apiInstance.post(
        `/Users/reset-password`,
        {...formData},
        {
            headers: {Authorization: `Bearer ${token}`},
        }
    );

export const verifyEmail = (formData, token) =>
    apiInstance.post(
        `/Users/verify-email`,
        {...formData},
        {
            headers: {Authorization: `Bearer ${token}`},
        }
    );

export const getSingleUser = (token, id) => {
    return apiInstance.get(`/users/${id}`, {
        headers: {Authorization: `Bearer ${token}`},
    });
}


export const getAllUsers = (token) => {
    return apiInstance.get(`/users`, {
        headers: {Authorization: `Bearer ${token}`},
    });
}

export const getProfitUserByRole = (token) => {
    return apiInstance.get(`/Users/getProfitByUserRole`, {
        headers: {Authorization: `Bearer ${token}`},
    });
}

export const getTotalOrders = (token) => {
    return apiInstance.get(`/Order/getTotalOrder`, {
        headers: {Authorization: `Bearer ${token}`},
    });
}

export const getProfitCountingUser = (token) => {
    return apiInstance.get(`/Users/getProfitCountingUser`, {
        headers: {Authorization: `Bearer ${token}`},
    });
}

export const getProfitTotalIncome = (token) => {
    return apiInstance.get(`/OrderDetail/getProfitTotalIncome`, {
        headers: {Authorization: `Bearer ${token}`},
    });
}



export const deleteUser = (token, id) => {
    return apiInstance.delete(`/users/${id}`, {
        headers: {Authorization: `Bearer ${token}`},
    });
}


// Test
// export const testApi = ({id, token}) => {
//     console.log("id is here " + id)
//     return apiInstance.get('/test', {
//         withCredentials: true,
//         headers: {
//             Authorization: `Bearer ${token}`,
//         }
//     })
// };

export const updateUser = (formData, id, token) => {
    return apiInstance.put(
        `/Users/${id}`,
        {...formData},
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
                "x-rapidapi-host": "file-upload8.p.rapidapi.com",
                "x-rapidapi-key": "your-rapidapi-key-here",
            },
        }
    );
}

export const createUser = (formData, token) => {
    return apiInstance.post(
        `/Users`,
        formData,
        {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
                'content-type': 'multipart/form-data',
            },
        }
    );
}

export const createBook = (formData, token) => {
    return apiInstance.post(
        `/Book`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                ContentType: "multipart/form-data",
            },
        }
    );
}

export const getBookById = (token, id) => {
    return apiInstance.get(
        `/Book/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}

export const getBookByCategoryId = (token, categoryId) => {
    return apiInstance.get(
        `/Book/getByCategoryId/${categoryId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}

export const getBookByRating = (token, rating) => {
    return apiInstance.get(
        `/Book/getByRating?rating=${rating}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}

export const reactiveUser = (token, id) => {
    return apiInstance.put(
        `/users/activate/${id}`,
        {},
        {
            headers: {Authorization: `Bearer ${token}`},
        }
    );
}

export const updatePassword = (token, id, password) => {
    return apiInstance.put(
        `/Users/changePassword/${id}`,
        password,
        {
            headers: {Authorization: `Bearer ${token}`}
        }
    );
}

export const updatePhoneNumber = (token, id, phoneNumber) => {
    console.log("decode ", phoneNumber)
    return apiInstance.put(
        `/Users/changePhoneNumber/${id}`,
        phoneNumber,
        {
            headers: {Authorization: `Bearer ${token}`}
        }
    );
}


export const updateUserImage = (token, id, file) => {
    // console.log(file)
    return apiInstance.put(
        `/Users/updateImage/${id}`,
        file,
        {
            headers: {Authorization: `Bearer ${token}`}
        }
    );
}

export const getStallByUserId = (token, id) => {
    return apiInstance.get(
        `/Stall/getByUserId/${id}`,
        {
            headers: {Authorization: `Bearer ${token}`}
        }
    );
}

// Stall API


export const createStall = (formData, token) => {
    return apiInstance.post(
        `/Stall`,
        formData,
        {
            headers: {Authorization: `Bearer ${token}`},
            'Content-Type': 'application/json'
        }
    );
}


export const getAllStalls = (token) => {
    return apiInstance.get(
        `/Stall`,
        {
            headers: {Authorization: `Bearer ${token}`},
            'Content-Type': 'application/json'
        }
    );
}

export const updateStallStatus = (token, stallId, stallStatus) => {
    return apiInstance.post(
        `/Stall/updateStallStatus/${stallId}?stallStatus=${stallStatus}`,
        null,
        {
            headers: {Authorization: `Bearer ${token}`},
            'Content-Type': 'application/json'
        }
    );
}


export const createComment = (formData, token) => {
    return apiInstance.post(
        `/Comment`,
        formData,
        {
            headers: {Authorization: `Bearer ${token}`},
            'Content-Type': 'application/json'
        }
    );
}


export const getAllComment = (token) => {
    return apiInstance.get(
        `/Comment`,
        {
            headers: {Authorization: `Bearer ${token}`},
            'Content-Type': 'application/json'
        }
    );
}

export const getAllCommentByPostId = (token, postId) => {
    return apiInstance.get(
        `/Comment/getAllByPostId/${postId}`,
        {
            headers: {Authorization: `Bearer ${token}`},
            'Content-Type': 'application/json'
        }
    );
}


// BOOK POST api
export const getPostByBookId = (token, bookId) => {
    return apiInstance.get(
        `/Post/getByBookId/${bookId}`,
        {
            headers: {Authorization: `Bearer ${token}`},
            "Content-Type": "application/json"
        }
    );
}




export const createBookPost = (formData, token) => {
    return apiInstance.post(
        `/Book/createBookPost`,
        formData,
        {
            headers: {Authorization: `Bearer ${token}`},
            'Content-Type': 'application/json'
        }
    );
}



export const getBookPostByUserId = (token, id) => {
    return apiInstance.get(
        `/Post/getByUserId/${id}`,
        {
            headers: {Authorization: `Bearer ${token}`},
            'Content-Type': 'application/json'
        }
    );
}

export const getBookBySort = (token, sort) => {
    return apiInstance.get(
        `/Book/getBookBySort?sort=${sort}`,
        {
            headers: {Authorization: `Bearer ${token}`},
            'Content-Type': 'application/json'
        }
    );
}

export const updateShippingStatus = (token, id, userId, shippingStatus) => {
    return apiInstance.post(
        `/Order/updateShippingStatus/${id}/${userId}?shippingStatus=${shippingStatus}`,
        null,
        {
            headers: {Authorization: `Bearer ${token}`},
            'Content-Type': 'application/json'
        }
    );
}

export const addToCart = (token, data) => {
    return apiInstance.post(
        `/Cart/addToCart`,
        data,
        {
            headers: {Authorization: `Bearer ${token}`},
            'Content-Type': 'application/json'
        }
    );
}

export const getAllCartByUserId = (token, userId) => {
    return apiInstance.get(
        `/Cart/${userId}`,
        {
            headers: {Authorization: `Bearer ${token}`},
            'Content-Type': 'application/json'
        }
    );
}

export const getAllCartSelected = (token, userId) => {
    return apiInstance.get(
        `/Cart/itemCartSelected/${userId}`,
        {
            headers: {Authorization: `Bearer ${token}`},
            'Content-Type': 'application/json'
        }
    );
}

export const reduceCartQuantity = (token, data) => {
    return apiInstance.post(
        `/Cart/reduceQuantity`,
        data,
        {
            headers: {Authorization: `Bearer ${token}`},
            'Content-Type': 'application/json'
        }
    );
}

export const incrementCartQuantity = (token, data) => {
    return apiInstance.post(
        `/Cart/incrementQuantity`,
        data,
        {
            headers: {Authorization: `Bearer ${token}`},
            'Content-Type': 'application/json'
        }
    );
}


export const updateCartItem = (token, id, data) => {
    return apiInstance.put(`/Cart/${id}`,
    data, 
    {
        headers: {Authorization: `Bearer ${token}`},
    });
}

export const removeCartItem = (token, data) => {
    return apiInstance.post(`/Cart/removeItemByUserId`,
        data,
        {
            headers: {Authorization: `Bearer ${token}`},
        });
}

export const deleteCartItem = (token, cartId) => {
    return apiInstance.delete(`/Cart/${cartId}`,
        {
            headers: {Authorization: `Bearer ${token}`},
        });
}

// address
export const createAddress = (token, data) => {
    return apiInstance.post(
        `/Address`,
        data,
        {
            headers: {Authorization: `Bearer ${token}`},
            'Content-Type': 'application/json'
        }
    );
}

export const getAddressByUserId = (token, userId) => {
    return apiInstance.get(
        `/Address/getByUserId/${userId}`,
        {
            headers: {Authorization: `Bearer ${token}`},
            'Content-Type': 'application/json'
        }
    );
}


export const deleteAddress = (token, userId) => {
    return apiInstance.delete(
        `/Address/${userId}`,
        {
            headers: {Authorization: `Bearer ${token}`},
            'Content-Type': 'application/json'
        }
    );
}


export const getDefaultAddress = (token, userId) => {
    return apiInstance.get(
        `/Address/getDefaultByUserId/${userId}`,
        {
            headers: {Authorization: `Bearer ${token}`},
            'Content-Type': 'application/json'
        }
    );
}


// Payment api

export const paymentIntent = (token,data) => {
    return apiInstance.post(
        `/Payment/create-payment-intent`,
        data,
        {
            headers: {Authorization: `Bearer ${token}`},
            "Content-Type": "application/json"
        }
    );
}

export const createOrderOrderDetail = (token,userId) => {
    return apiInstance.post(
        `/Order/createOrderOrderDetail/${userId}`,
        null,
        {
            headers: {Authorization: `Bearer ${token}`},
            "Content-Type": "application/json"
        }
    );
}

export const createOrderCashPayment = (token,userId) => {
    return apiInstance.post(
        `/Order/createOrderCashPayment/${userId}`,
        null,
        {
            headers: {Authorization: `Bearer ${token}`},
            "Content-Type": "application/json"
        }
    );
}

export const getAllOrderDetail = (token,userId) => {
    return apiInstance.get(
        `/Order/getAllByUserId/${userId}`,
        {
            headers: {Authorization: `Bearer ${token}`},
            "Content-Type": "application/json"
        }
    );
}

export const getAllOrders = (token,userId) => {
    return apiInstance.get(
        `/Order/getOrdersByUserId/${userId}`,
        {
            headers: {Authorization: `Bearer ${token}`},
            "Content-Type": "application/json"
        }
    );
}

export const getOrdersByStallId = (token,stallId, filter) => {
    return apiInstance.get(
        `/Order/getOrdersByStallId/${stallId}?filter=${filter}`,
        {
            headers: {Authorization: `Bearer ${token}`},
            "Content-Type": "application/json"
        }
    );
}

export const getTopUser = (token) => {
    return apiInstance.get(
        `/OrderDetail/getTopUser`,
        {
            headers: {Authorization: `Bearer ${token}`},
            "Content-Type": "application/json"
        }
    );
}

export const getTopUserStall = (token, stallId) => {
    return apiInstance.get(
        `/OrderDetail/getTopUserStall/${stallId}`,
        {
            headers: {Authorization: `Bearer ${token}`},
            "Content-Type": "application/json"
        }
    );
}


export const getProfitByStallId = (token,stallId) => {
    return apiInstance.get(
        `/Order/getProfitByStallId/${stallId}`,
        {
            headers: {Authorization: `Bearer ${token}`},
            "Content-Type": "application/json"
        }
    );
}

export const getProfitBookQuality = (token) => {
    return apiInstance.get(
        `/Book/getProfitBookQuality`,
        {
            headers: {Authorization: `Bearer ${token}`},
            "Content-Type": "application/json"
        }
    );
}

export const getOrderDetailByOrderIdStallId = (token, orderId, stallId) => {
    return apiInstance.get(
        `/OrderDetail/getByOrderIdStallId?orderId=${orderId}&stallId=${stallId}`,
        {
            headers: {Authorization: `Bearer ${token}`},
            "Content-Type": "application/json"
        }
    );
}

export const getOrderDetailByOrderId = (token, orderId) => {
    return apiInstance.get(
        `/OrderDetail/getByOrderId?orderId=${orderId}`,
        {
            headers: {Authorization: `Bearer ${token}`},
            "Content-Type": "application/json"
        }
    );
}


// Category
export const getAllCategories = (token) => {
    return apiInstance.get(
        `/Category`,
        {
            headers: {Authorization: `Bearer ${token}`},
            "Content-Type": "application/json"
        }
    );
}


export const deleteCategory = (token, id) => {
    return apiInstance.delete(
        `/Category/${id}`,
        {
            headers: {Authorization: `Bearer ${token}`},
            "Content-Type": "application/json"
        }
    );
}

export const createNewCategory = (token, categoryName) => {
    return apiInstance.post(
        `/Category?categoryName=${categoryName}`,
        null,
        {
            headers: {Authorization: `Bearer ${token}`},
            "Content-Type": "application/json"
        }
    );
}



export const getProfitByQuantity = (token, stallId) => {
    return apiInstance.get(
        `/Order/getProfitByQuantity/${stallId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}


export const updateBookPost = (token, bookId, formData) => {
    return apiInstance.put(
        `/Book/updateBookPost/${bookId}`,
        formData,
        {
            headers: {Authorization: `Bearer ${token}`},
        }
    );
}


export const activateUserAccount = (token, id) => {
    return apiInstance.put(
        `/Users/activate/${id}`,
        null,
        {
            headers: {Authorization: `Bearer ${token}`},
            "Content-Type": "application/json"
        }
    );
}

export const deleteUserAccount = (token, id) => {
    return apiInstance.delete(
        `/Users/${id}`,
        {
            headers: {Authorization: `Bearer ${token}`},
            "Content-Type": "application/json"
        }
    );
}


// Chat

export const fetchChats = (token, id) => {
    return apiInstance.get(
        `/chats`,
        {
            headers: {Authorization: `Bearer ${token}`},
            "Content-Type": "application/json"
        }
    );
}

export const uploadImageChats = (token, data) => {
    return apiInstance.post(
        `/chats/upload-image`,
        data,
        {
            headers: {Authorization: `Bearer ${token}`},
            credentials: "include",
        }
    );
}

export const paginateMessages = (token, id, page) => {
    return apiInstance.get(
        `/chats/messages/${id}/${page}`,
        {
            headers: {Authorization: `Bearer ${token}`},
            "Content-Type": "application/json"
        }
    );
}

export const createChat = (token, partnerId) => {
    return apiInstance.post(
        `/chats/create`,
        { partnerId },
        {
            headers: {Authorization: `Bearer ${token}`},
            "Content-Type": "application/json"
        }
    );
}


export const deleteCurrentChat = (token, chatId) => {
    return apiInstance.delete(
        `/chats/${chatId}`,
        {
            headers: {Authorization: `Bearer ${token}`},
            "Content-Type": "application/json"
        }
    );
}







