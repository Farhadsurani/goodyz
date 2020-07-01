import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import { TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faWallet, faQrcode, faUser } from '@fortawesome/free-solid-svg-icons';

import WalletCmp from '../components/tabs/wallet';
import QrCodeCmp from '../components/tabs/qrCode';
import ProfileCmp from '../components/tabs/profile';
import EditProfileCmp from '../components/tabs/editProfile';
import ChangePasswordCmp from '../components/tabs/chnagePassword'

import { color } from '../constants/theme';

const Wallet = 
  createStackNavigator(
    {
      WalletCmp,
    },
    {
      initialRouteParams: 'WalletCmp',
      navigationOptions: ({navigation}) => {
        let { routeName } = navigation.state.routes[navigation.state.index];
        let navigationOptions = {
          tabBarIcon: ({ tintColor }) => {
            if (tintColor === color.yellow) {
              return (
                <TouchableOpacity>
                  <FontAwesomeIcon icon={faWallet} size={20} color={color.yellow} />
                </TouchableOpacity>
              );
            } else {
              return (
                <FontAwesomeIcon icon={faWallet} size={18} color={color.darkGrey} />
              );
            }
          }
        };
    
        // if (routeName === 'TredingScreen') {
        //   navigationOptions.tabBarVisible = false;
        // }else if (routeName === 'CategoryScreen'){
        //   navigationOptions.tabBarVisible = false;
        // }else if (routeName === 'RestaurantScreen'){
        //   navigationOptions.tabBarVisible = false;
        // }
        // else if (routeName === 'GalleryScreen'){
        //   navigationOptions.tabBarVisible = false;
        // }
        
        return navigationOptions;
      }
    }
);

const QrCode = 
  createStackNavigator(
    {
      QrCodeCmp,
    },
    {
      initialRouteParams: 'QrCodeCmp',
      navigationOptions: ({navigation}) => {
        let { routeName } = navigation.state.routes[navigation.state.index];
        let navigationOptions = {
          tabBarIcon: ({ tintColor }) => {
            if (tintColor === color.yellow) {
              return (
                <TouchableOpacity>
                  <FontAwesomeIcon icon={faQrcode} size={20} color={color.yellow} />
                </TouchableOpacity>
              );
            } else {
              return (
                <FontAwesomeIcon icon={faQrcode} size={18} color={color.darkGrey} />
              );
            }
          }
        };
    
        // if (routeName === 'TredingScreen') {
        //   navigationOptions.tabBarVisible = false;
        // }else if (routeName === 'CategoryScreen'){
        //   navigationOptions.tabBarVisible = false;
        // }else if (routeName === 'RestaurantScreen'){
        //   navigationOptions.tabBarVisible = false;
        // }
        // else if (routeName === 'GalleryScreen'){
        //   navigationOptions.tabBarVisible = false;
        // }
        
        return navigationOptions;
      }
    }
);

const Profile = 
  createStackNavigator(
    {
      ProfileCmp,
      EditProfileCmp,
      ChangePasswordCmp
    },
    {
      initialRouteParams: 'ProfileCmp',
      navigationOptions: ({navigation}) => {
        let { routeName } = navigation.state.routes[navigation.state.index];
        let navigationOptions = {
          tabBarIcon: ({ tintColor }) => {
            if (tintColor === color.yellow) {
              return (
                <TouchableOpacity>
                  <FontAwesomeIcon icon={faUser} size={20} color={color.yellow} />
                </TouchableOpacity>
              );
            } else {
              return (
                <FontAwesomeIcon icon={faUser} size={18} color={color.darkGrey} />
              );
            }
          }
        };
    
        if (routeName === 'EditProfileCmp')
          navigationOptions.tabBarVisible = false;
        else if (routeName === 'ChangePasswordCmp')
          navigationOptions.tabBarVisible = false;
        // }else if (routeName === 'RestaurantScreen'){
        //   navigationOptions.tabBarVisible = false;
        // }
        // else if (routeName === 'GalleryScreen'){
        //   navigationOptions.tabBarVisible = false;
        // }
        
        return navigationOptions;
      }
    }
  );

const TabsStack = createBottomTabNavigator(
  {
    Wallet: Wallet,
    QrCode: QrCode,
    Profile: Profile,
  },
  {
    initialRouteName:'QrCode',
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: color.yellow,
      showLabel: true,
      style:{
        shadowColor: 'rgba(58,55,55,0.1)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 15,
        elevation: 3,
        borderTopColor: 'transparent',
        backgroundColor:'#fff',
        height: 50,
        marginBottom:20,
        width:'80%',
        alignContent:'center',
        alignSelf:'center',
        alignItems:'center',
        backgroundColor:'#333333',
        borderRadius:10,
        position:'absolute'
      },
    }
  },
  {
    navigationOptions: {
      headerMode: "none"
    }
  }
);

export default createAppContainer(TabsStack);
