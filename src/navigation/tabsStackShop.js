import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import { TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSignal, faQrcode, faUser } from '@fortawesome/free-solid-svg-icons';

import AnalyticsCmp from '../components/tabs/analytics';
import QrCodeCmp from '../components/tabs/qrCode';
import ProfileCmp from '../components/tabs/profile';
import EditProfileCmp from '../components/tabs/editProfile';
import ChangePasswordCmp from '../components/tabs/chnagePassword';
import QrDetailCmp from '../components/tabs/qrDetail';
import GoodyzListCmp from '../components/tabs/goodyzList';
import VoucherDetailCmp from '../components/tabs/voucherDetail';
import TotalVouchersRedeemedCmp from '../components/tabs/totalVouchersRedeemed';
import SingleVoucherReportCmp from '../components/tabs/singleVoucherReport';

import { color } from '../constants/theme';

const Analytics = 
  createStackNavigator(
    {
        AnalyticsCmp,
        TotalVouchersRedeemedCmp,
        SingleVoucherReportCmp
    },
    {
      initialRouteParams: 'AnalyticsCmp',
      navigationOptions: ({navigation}) => {
        let { routeName } = navigation.state.routes[navigation.state.index];
        let navigationOptions = {
          tabBarIcon: ({ tintColor }) => {
            if (tintColor === color.yellow) {
              return (
                <TouchableOpacity>
                  <FontAwesomeIcon icon={faSignal} size={20} color={color.yellow} />
                </TouchableOpacity>
              );
            } else {
              return (
                <FontAwesomeIcon icon={faSignal} size={18} color={color.darkGrey} />
              );
            }
          }
        };
    
        if (routeName === 'TotalVouchersRedeemedCmp')
          navigationOptions.tabBarVisible = false;
        else if (routeName === 'SingleVoucherReportCmp')
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

const QrCode = 
  createStackNavigator(
    {
      QrCodeCmp,
      QrDetailCmp,
      GoodyzListCmp,
      VoucherDetailCmp,
    //   Signin
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
    
        if (routeName === 'QrDetailCmp')
          navigationOptions.tabBarVisible = false;
        else if (routeName === 'GoodyzListCmp')
          navigationOptions.tabBarVisible = false;
        else if (routeName === 'VoucherDetailCmp')
          navigationOptions.tabBarVisible = false;
        
        else if (routeName === 'Signin')
          navigationOptions.tabBarVisible = false;
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

const TabsStackShop = createBottomTabNavigator(
  {
    Analytics: Analytics,
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

export default createAppContainer(TabsStackShop);
