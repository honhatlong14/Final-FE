const routes = {
    home: '/',
    register: '/register',
    login: '/login',
    users: '/users',
    resetPassword: '/account/reset-password',
    verifyEmail: '/verify-email',
    // admin page
    admin: '/admin',
    editUser: '/admin/editUser/:id',
    createUser: '/admin/createUser',
    // Book CRUD
    createBookAdmin: '/admin/createBook',

    // user
    userProfile: '/profile',
    updatePassword: '/profile/updatePassword',
    stallProfile: '/profile/stall',
    addressProfile: '/profile/address',
    createAddress: '/profile/address/create',
    updatePhoneNumber: '/profile/updatePhoneNumber',


    createBook: '/stall/createBook',
    viewBook: '/stall/viewAllBook',
    bookDetailStall: 'stall/bookDetail/:id',
    bookDetail: '/bookDetail/:id',


    listOrders: '/stall/manager/listOrders',
    viewOrdersDetail: '/stall/manager/listOrders/:id',
    updateBook: '/stall/updateBook/:id',

    ordersDetailCustomer: '/profile/order/orderDetail/:id',

    payment: '/checkout/payment',
    

    cart: '/cart',
    createOrder: '/createOrder',

    order:'/order',

    adminCategory:'/admin/category',
    adminCreateCategory:'/admin/createCategory',

    adminStall:'/admin/stall',


    chat:'/chat',

};


export default routes;