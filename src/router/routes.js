import config from '../config';

import LoginPage from '../screens/login';
import HomePage from '../screens/home';
import ResetPassword from '../screens/users/resetPassword';
import VerifyEmailPage from '../screens/users/verifyEmail';
import RegisterPage from "../screens/users/register";
import AdminPage from "../screens/admin/adminPage";
import Profile from "../screens/users/profile/profile";
import EditUserPage from "../screens/admin/user/editUser";
import CreateUserPage from "../screens/admin/user/createUser";

import UpdatePasswordPage from "../screens/users/profile/updatePassword";
import StallPage from "../screens/users/stall/stall";
import CreateBookAdminPage from "../screens/admin/book/createBookAdmin";
import CreateBookPage from "../screens/users/stall/createBook";
import ViewAllBookPage from "../screens/users/stall/viewAllBook";
import BookDetailPage from "../screens/home/bookDetail";
import CartPage from "../screens/users/orderProcess/cart";
import AddressPage from "../screens/users/profile/address";
import CreateAddressPage from "../screens/users/profile/address/createAddress";
import PaymentPage from "../screens/users/orderProcess/payment";
import CreateOrderPage from "../screens/users/orderProcess/createOrder";
import OrderPage from "../screens/users/profile/order";
import ListOrdersPage from "../screens/users/stall/listOrders";
import ViewOrderDetail from "../screens/users/stall/viewOrderDetail";
import OrderDetailCustomer from "../screens/users/profile/order/orderDetailCustomer";
import UpdateBookPage from "../screens/users/stall/updateBook";
import CategoryPage from "../screens/admin/category";
import CreateCategoryPage from "../screens/admin/category/createCategory";
import AdminStallPage from "../screens/admin/stall";
import BookDetailStall from "../screens/users/stall/bookDetailStall";
import UpdatePhoneNumber from "../screens/users/profile/updatePhoneNumber";
import Chat from "../screens/chat/Chat";
const unAuthorizeRoutes = [
    {path: config.routes.verifyEmail, component: VerifyEmailPage},
    {path: config.routes.login, component: LoginPage},
    {path: config.routes.register, component: RegisterPage},
    {path: config.routes.resetPassword, component: ResetPassword},
];


const privateRoutes = [
    {path: config.routes.userProfile, component: Profile},
    {path: config.routes.admin, component: AdminPage},
    {path: config.routes.home, component: HomePage},
    {path: config.routes.editUser, component: EditUserPage},
    {path: config.routes.createUser, component: CreateUserPage},
    {path: config.routes.createBookAdmin, component: CreateBookAdminPage},
    {path: config.routes.adminCategory, component: CategoryPage},
    {path: config.routes.adminCreateCategory, component: CreateCategoryPage},
    {path: config.routes.adminStall, component: AdminStallPage},

    {path: config.routes.updatePassword, component: UpdatePasswordPage},
    {path: config.routes.stallProfile, component: StallPage},
    {path: config.routes.addressProfile , component: AddressPage },
    {path: config.routes.createAddress , component: CreateAddressPage },
    {path: config.routes.updatePhoneNumber, component: UpdatePhoneNumber},

    {path: config.routes.createBook, component: CreateBookPage },
    {path: config.routes.viewBook , component: ViewAllBookPage },
    {path: config.routes.bookDetail , component: BookDetailPage },
    {path: config.routes.bookDetailStall , component: BookDetailStall},
    {path: config.routes.updateBook , component: UpdateBookPage},

    {path: config.routes.cart , component: CartPage },
    {path: config.routes.createOrder , component: CreateOrderPage },
    {path: config.routes.payment , component: PaymentPage },
    {path: config.routes.order , component: OrderPage },
    {path: config.routes.listOrders , component: ListOrdersPage },

    {path: config.routes.viewOrdersDetail , component: ViewOrderDetail},
    {path: config.routes.ordersDetailCustomer , component: OrderDetailCustomer},

    {path: config.routes.chat, component: Chat},

];

const adminRoutes = [
    {path: config.routes.admin, component: AdminPage},
    {path: config.routes.home, component: HomePage},
    {path: config.routes.editUser, component: EditUserPage},
    {path: config.routes.createUser, component: CreateUserPage},
    {path: config.routes.createBookAdmin, component: CreateBookAdminPage},
]


export {unAuthorizeRoutes, privateRoutes, adminRoutes};
