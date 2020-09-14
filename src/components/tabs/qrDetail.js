import React, {Component} from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView, Image, AsyncStorage } from 'react-native';

import { ImageCard, Button } from '../common';
import { color } from '../../constants/theme';
import { data } from '../../constants/data';

import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import { ScaledSheet } from 'react-native-size-matters';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faHistory } from '@fortawesome/free-solid-svg-icons';
import { requestOneTimePayment } from 'react-native-paypal';

const {height: deviceHeight, width: deviceWidth} = Dimensions.get('screen');

export default class QrDetailCmp extends Component {

  static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: (
				<View style={{width:'100%', justifyContent:'center', alignItems:'center', backgroundColor:color.primary, flexDirection:'row', marginRight:20}}>
					<Text style={{fontSize: 20, color:color.dark}}>QR Details</Text>
				</View>
			),
			headerTitleStyle: { flex: 1, textAlign: "center" },
			headerStyle: {
				backgroundColor: color.primary
      },
      headerLeft:(
        <TouchableOpacity activeOpacity={0.5} style={{marginLeft:10}} onPress={()=> navigation.pop()}>
          <FontAwesomeIcon icon={faChevronLeft} size={20} color={color.dark} />
        </TouchableOpacity>
      ),
      headerRight:(
        <TouchableOpacity activeOpacity={0.5} style={{marginRight:10}} onPress={()=> navigation.navigate('EventMediaCmp')}>
          <FontAwesomeIcon icon={faHistory} size={20} color={color.dark} />
        </TouchableOpacity>
      )
		}
  };

  constructor(props){
    super(props);
    this.state = {
      isRedeemed:false,
      data: this.props.navigation.getParam('data').data,
      width:'',
      height:'',
      showSpinner:false,
    }
  }

  componentDidMount() {
    console.log(this.state.data);
    if(this.state.data.event_fee > 0) {
      this.checkUserEventPayment();
    }
  }

  gotoDetail = () => {
    console.log('gotoDetails')
  }

  detail = () => {
    this.props.navigation.navigate('GoodyzListCmp', {data: this.state.data.offers});
  }

  async checkUserEventPayment() {
    this.setState({showSpinner:true});
    const URL = 'https://kanztainer.com/goodyz/api/v1/event/check-user-payment/'+this.state.data.id;
    const access_token = await AsyncStorage.getItem('access_token');
    const header = {
      headers:{
        'Authorization':'Bearer '.concat(access_token)
      }
    }
    axios.get(URL, header).then(
      response=> {
        console.log(response.data);
        this.setState({showSpinner:false});
      },
      error => {
        console.log('checkUserEventPayment: ', error.toString());
        if(error.toString().includes('401')) {
          axios.post('https://kanztainer.com/goodyz/api/v1/refresh', {}, header).then(
            async response => {
              await AsyncStorage.setItem('access_token', response.data.data.user.access_token)
              this.checkUserEventPayment();
            },
            error => {
              console.log(error);
              this.setState({showSpinner:false});
            }
          );
        }
        else
          this.initiatePayment();
      }
    )
  }

  initiatePayment = async() => {
    let token = '';
    console.log(this.state.data.event_fee);
    const URL = 'https://kanztainer.com/goodyz/api/v1/paypal/token';
    const access_token = await AsyncStorage.getItem('access_token');
    const header = {
      headers:{
        'Authorization':'Bearer '.concat(access_token)
      }
    }
    axios.post(URL, {}, header).then(
      async response=> {
        token = (response.data.data.access_token);
        // token = 'sandbox_9dbg82cq_dcpspy2brwdjr3qn'
        console.log(token);
        try {
          const {
            nonce,
            payerId,
            email,
            firstName,
            lastName,
            phone 
          } = await requestOneTimePayment(
            'sandbox_9dbg82cq_dcpspy2brwdjr3qn',
            {
              amount: this.state.data.event_fee.toString(), // required
              // any PayPal supported currency (see here: https://developer.paypal.com/docs/integration/direct/rest/currency-codes/#paypal-account-payments)
              currency: 'USD',
              // any PayPal supported locale (see here: https://braintree.github.io/braintree_ios/Classes/BTPayPalRequest.html#/c:objc(cs)BTPayPalRequest(py)localeCode)
              localeCode: 'en_US', 
              shippingAddressRequired: false,
              userAction: 'commit', // display 'Pay Now' on the PayPal review page
              // one of 'authorize', 'sale', 'order'. defaults to 'authorize'. see details here: https://developer.paypal.com/docs/api/payments/v1/#payment-create-request-body
              intent: 'sale', 
            }
          );
          console.log(
            'nonce: '+nonce,
            'payerId: '+payerId,
            'email: ', email,
            'firstName: '+firstName,
            'lastName: '+lastName,
            'phone: '+phone 
          );
          this.setState({showSpinner:false});
          this.storeUserPayment();
        }
        catch(ex) {
          console.log(ex.toString());
          this.setState({showSpinner:false});
          this.props.navigation.pop();
        }
      },
      error => {
        console.log('error: ',error);
        this.setState({showSpinner:false});
        this.props.navigation.pop();
      }
    )
  }

  async storeUserPayment() {
    const URL = 'https://kanztainer.com/goodyz/api/v1/event/user-paypal-payment';
    const access_token = await AsyncStorage.getItem('access_token');
    const header = {
      headers:{
        'Authorization':'Bearer '.concat(access_token)
      }
    }

    axios.post(URL, {}, header).then(
      response=> console.log(response),
      error => console.log(error)
    )
  }

  render(){
    const { mainContainer, btnContainer, spinnerTextStyle, horizontal } = styles;

    return(
      <View style={{flex:1}}>
        <ScrollView style={{backgroundColor:color.ligth}}>
          <View style={mainContainer}>
            <ImageCard 
              logo={{uri:this.state.data.logo_url}} 
              text={this.state.data.name}
              bigImage={{uri:this.state.data.banner_image_url}}
              isRedeemed={this.state.data.is_redeemed}
              // onPress={this.gotoDetail}
              isDetail={true}
              expire={data[1].expire}
              description={this.state.data.description}
              height={200}
              // isRedeemed={this.state.isRedeemed}
            />
          </View>
        </ScrollView>
        <View style={btnContainer}>
          <Button 
            btnColor={color.yellow} 
            textColor={color.dark} 
            btnName={'VIEW GOODYZ'} 
            borderRadius={50} 
            width={Dimensions.get('screen').width-50}
            onPress={this.detail}
            isDisable={this.state.isRedeemed}
          />
        </View>
        <View style={horizontal}>
          <Spinner 
            textContent={'Loading...'}
            animation='fade'
            textStyle={spinnerTextStyle}
            visible={this.state.showSpinner}
          />
        </View>
      </View>
    )
  }
}

const styles = ScaledSheet.create({
  mainContainer:{
    backgroundColor:color.ligth,
    marginBottom:20,
    justifyContent:'center',
    alignItems:'center'
  },
  btnContainer:{
    height:80,
    paddingTop:20,
    width:Dimensions.get('screen').width,
    alignItems:'center',
    backgroundColor:color.ligth,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
    borderTopColor:'#e5e5e5',
    borderTopWidth:2
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  horizontal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  }
})