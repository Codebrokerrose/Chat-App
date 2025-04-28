import {createBrowserRouter} from 'react-router-dom';
import CheckEmailPage from '../pages/CheckEmailPage';
import MessagePage from '../components/MessagePage';
import CheckPasswordPage from '../pages/CheckPasswordpage';
import Home from '../pages/Home';
import RegisterPage from '../pages/RegisterPage';
import App from '../App';
import AuthLayouts from '../layout/index';
import ForgotPassword from '../pages/ForgotPassword';
import AnonymousChatEntry from '../pages/AnonymousChatEntry';
import AnonymousChatRoom from '../pages/AnonymousChatRoom';

const router = createBrowserRouter([
    {
        path : "/",
        element : <App />, //root component
        children : [
            {
                path : "register",
                element : <AuthLayouts><RegisterPage /></AuthLayouts>
            },
            {
                path : "email",
                element : <AuthLayouts><CheckEmailPage /></AuthLayouts>
            },
            {
                path : "password",
                element : <AuthLayouts><CheckPasswordPage /></AuthLayouts>
            },
            {
                path : "forgot-password",
                element : <AuthLayouts><ForgotPassword /></AuthLayouts>
            },
            {
                path: "anonymous",
                element: <AuthLayouts><AnonymousChatEntry /></AuthLayouts>
            },
            {
                path: "anon-chat/:sessionId",
                element: <AnonymousChatRoom />
            },
            {
                path : "",
                element : <Home />,
                children : [
                    {
                        path : ':userId', //dynamic id
                        element : <MessagePage />
                    }
                ]
            }
        ]
    }
]);

export default router;