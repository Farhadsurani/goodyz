import { createStackNavigator } from 'react-navigation-stack';
import Signin from '../components/auth/signin';
import Signup from '../components/auth/signup';
import ForgetPasswordCmp from '../components/auth/forgetPassword';

const AuthStack = createStackNavigator({
    Signin: Signin,
    Signup: Signup,
    Forgot: ForgetPasswordCmp,
},
    (
        navigationOptions = {
            headerMode: "none"
        }
    )
);

export default AuthStack;