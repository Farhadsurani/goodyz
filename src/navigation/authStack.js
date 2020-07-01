import { createStackNavigator } from 'react-navigation-stack';
import Signin from '../components/auth/signin';
import Signup from '../components/auth/signup';

const AuthStack = createStackNavigator({
    Signin: Signin,
    Signup: Signup,
    // Forgot: ForgotScreen,
},
    (
        navigationOptions = {
            headerMode: "none"
        }
    )
);

export default AuthStack;