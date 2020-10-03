import React, {Component} from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView, Image, AsyncStorage, Modal } from 'react-native';

import { ImageCard, Button } from '../common';
import { color } from '../../constants/theme';
import { data } from '../../constants/data';

import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';

import { ScaledSheet } from 'react-native-size-matters';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faHistory, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";

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
        <TouchableOpacity activeOpacity={0.5} style={{marginRight:10}} onPress={()=> navigation.state.params.dispatch()}>
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
      modalVisible: false,
      status:false,
      values:''
    }
  }

  componentDidMount() {
    console.log('event_fee: ', this.state.data.event_fee);
    if(this.state.data.event_fee > 0) {
      this.checkUserEventPayment();
    }
    this.props.navigation.setParams({
      dispatch: this.dispatch.bind(this)
    });
  }

  dispatch() {
    this.props.navigation.navigate('EventMediaCmp', {id: this.state.data.id});
  }

  gotoDetail = () => {
    console.log('gotoDetails')
  }

  detail = () => {
    this.props.navigation.navigate('GoodyzListCmp', {data: this.state.data.offers});
  }

  async checkUserEventPayment() {
    console.log('this.checkUserEventPayment')
    // this.setState({showSpinner:true});
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
              console.log('refresh token error: ', error);
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
    console.log('initiatePayment');
    this.setState({showSpinner:false, modalVisible:true}, ()=> {
      this.setState({modalVisible:true})
    });
  }

  doStripePayment = async() => {
    console.log(this.state.status);
    console.log(this.state.values);
    if(this.state.status) {
      console.log('valid')
      this.setState({modalVisible:false, showSpinner:true});
      const URL = 'https://kanztainer.com/goodyz/api/v1/event/user-stripe-payment';
      const access_token = await AsyncStorage.getItem('access_token');
      const header = {
        headers:{
          'Authorization':'Bearer '.concat(access_token)
        }
      }
      console.log(header.headers)
      const data = {
        event_id:this.state.data.id,
        amount:this.state.data.event_fee,
        card_number:this.state.values.number,
        card_cvc:this.state.values.cvc,
        card_expiry_month:this.state.values.expiry.substring(0, 2),
        card_expiry_year:this.state.values.expiry.substring(3, 6)
      }
      console.log(data);
      axios.post(URL, data, header).then(
        response=> {
          console.log(response.data);
          this.setState({showSpinner:false});
        },
        error => {
          console.log(error);
          this.props.navigation.pop();
        }
      )
    }
  }

  async storeUserPayment(nonce) {
    const URL = 'https://kanztainer.com/goodyz/api/v1/event/user-paypal-payment';
    const access_token = await AsyncStorage.getItem('access_token');
    const header = {
      headers:{
        'Authorization':'Bearer '.concat(access_token)
      }
    }
    const data = {
      event_id:this.state.data.id,
      amount:this.state.data.event_fee,
      payment_status:'paid',
      payment_gateway:'paypal',
      transaction_id:nonce,
      transaction_response:'200'
    };
    console.log(data);
    axios.post(URL, data, header).then(
      response=> console.log(response),
      error => console.log('store user Payment: ', error)
    )
  }

  _onChange = form => {
    console.log(form.status)
    console.log(form.values)
    if(form.status.cvc == 'valid', form.status.expiry == 'valid', form.status.number == 'valid')
      this.setState({status:true, values:form.values});
    else {
      this.setState({status:false});
    }
  };

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
        <Modal
          animationType="fade"
          transparent={true}
          hardwareAccelerated={true}
          visible={this.state.modalVisible}
        >
					<View style={{height:deviceHeight, width:deviceWidth, justifyContent:'flex-end', alignContent:'flex-end', alignItems:'flex-end', backgroundColor:'#24242457'}}>
            <View style={{
                flexDirection:'column', 
                height:deviceHeight-500, 
                width:deviceWidth, 
                backgroundColor:'#fff', 
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.23,
                shadowRadius: 2.62,
                elevation: 4,
                justifyContent:'center',
                alignItems:'center'
              }}
            >	
							<View style={{width:'100%', height:20, position:'absolute', top:5, right:5, alignItems:'flex-end'}}>
								<TouchableOpacity activeOpacity={0.5} onPress={()=> {this.setState({modalVisible:false});this.props.navigation.pop()}}>
									<FontAwesomeIcon icon={faTimesCircle} size={20} color={color.dark} />
								</TouchableOpacity>
							</View>
              <View style={{marginTop:20, height:300}}>
                <CreditCardInput onChange={this._onChange} />
              </View>
              <Button 
                btnColor={color.yellow} 
                textColor={color.dark} 
                btnName={'PROCEED TO PAY'}
                borderRadius={50}
                width={Dimensions.get('screen').width-50}
                onPress={this.doStripePayment}
                isDisable={this.state.isRedeemed}
              />
            </View>
          </View>
        </Modal>
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