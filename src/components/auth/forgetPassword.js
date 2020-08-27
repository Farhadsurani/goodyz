import React, { Component, useRef } from 'react';
import { View, Image, ScrollView, Text, Dimensions, AsyncStorage, TouchableOpacity, SafeAreaView } from "react-native";

import { images, color } from '../../constants/theme';
import { FloatingInput, Button } from '../common';

import { ScaledSheet, ms } from 'react-native-size-matters';
import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from "react-native-dialog";
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import OTPInputView from '@twotalltotems/react-native-otp-input';

const {height: deviceHeight, width: deviceWidth} = Dimensions.get('screen');

export default class ForgetPasswordCmp extends Component {

  constructor(props){
    super(props);
    this.state = {
      step:0,
      email:'',
      code:'',
      password:'',
      password_confirmation:'',
      error: '',
      showSpinner:false,
      showAlert:false,
      errorMsg:'',
      errorTitle:'',
    }
  }

  
  forget = async() => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    this.setState({error:''});

    if(this.state.email == '')
      this.setState({error:'Email field cannot be empty.'})
    else if(!reg.test(this.state.email))
      this.setState({error:'Email not valid.'});

    else {
      this.setState({showSpinner:true});
      console.log('email: ', this.state.email)
      axios.get('https://kanztainer.com/goodyz/api/v1/forget-password?email='+this.state.email).then(
      async (res)=> {
        console.log(res.data);
        this.setState({step: 1}, ()=> {
          this.setState({showSpinner:false, showAlert:true, errorMsg:res.data.message, errorTitle:'Success!!'})
        });
      }).catch(
        (error)=> {
          console.log('error', error);
          this.setState({showSpinner:false, showAlert:true, errorMsg:'Email address not found.'+error, errorTitle:'Server Error!!'})
        }
      );
    }
  }

  verifyCode = () => {
    console.log(this.state.code);
    if(this.state.code == '')
      this.setState({error:'Please fill the OTP code fields.'})
    else if(this.state.code.length != 4)
      this.setState({error:'Please fill out 4 digit code.'})
    else {
      this.setState({showSpinner:true});
      axios.post('https://kanztainer.com/goodyz/api/v1/verify-reset-code?verification_code='+this.state.code).then(
      async (res)=> {
        console.log(res.data);
        this.setState({step: 2, showSpinner:false});
      }).catch(
        (error)=> {
          console.log('error', error);
          this.setState({showSpinner:false, showAlert:true, errorMsg:'Invalid code.'+error, errorTitle:'Server Error!!'})
        }
      );
    }
  }

  reset = () => {
    this.setState({error:''})
    if(this.state.password == '')
      this.setState({error:'Password filed cannot be empty.'});
    else if(this.state.password_confirmation == '')
      this.setState({error:'Confirm password filed cannot be empty.'});
    else if(this.state.password.length < 6)
      this.setState({error:'Password must be 6 charactors long.'});
    else if(this.state.password != this.state.password_confirmation)
      this.setState({error:'Password not matched.'});
    
    else{
      this.setState({showSpinner:true});
      const URL = 'https://kanztainer.com/goodyz/api/v1/reset-password?email='+this.state.email+'&verification_code='+this.state.code+'&password='+this.state.password+'&password_confirmation='+this.state.password_confirmation;
      axios.post(URL).then(
      async (res)=> {
        console.log(res.data);
        this.setState({showSpinner:false});
        this.props.navigation.pop();
      }).catch(
        (error)=> {
          console.log('error', error);
          this.setState({showSpinner:false, showAlert:true, errorMsg:'Invalid code.'+error, errorTitle:'Server Error!!'})
        }
      );
    }
  }

  handleCancel() {
    this.setState({showAlert:false});
  }

  back = () => {
    this.props.navigation.pop();
  }

  render(){
    const { mainContainer, imageContainer, formContainer, horizontal, spinnerTextStyle, underlineStyleBase, underlineStyleHighLighted } = styles;

    return(
      <SafeAreaView>
        <ScrollView>
          <View style={{position:'absolute', left:10, top:10, zIndex:9}}>
            <TouchableOpacity activeOpacity={0.5} onPress={this.back}>
              <FontAwesomeIcon icon={faArrowLeft} size={22} color={color.orange} />
            </TouchableOpacity>
          </View>
          <View style={mainContainer}>
            <View style={imageContainer}>
              <Image source={images.logo} resizeMode={'contain'} style={{width:100, height:100}}/>
            </View>
            
            <Text style={{marginTop:10, fontSize:ms(30), fontWeight:'bold'}}>Forget Password</Text>
            {
              this.state.step == 0 ?
              <>
              <View style={formContainer}>
                <FloatingInput
                  margin={ms(9)}
                  width={ms(250)} 
                  keyboardType={'email-address'}
                  label={'Email'} 
                  value={this.state.email}
                  onChangeText={text => {
                    this.setState({ email: text });
                  }}
                />
              </View>
              {
                this.state.error != '' ?
                <Text style={{textAlign: 'justify',justifyContent: 'center',color: 'red', marginBottom:20}}>{this.state.error}</Text>:null
              }
              <View>
                <Button btnName={'Verify Email'} btnColor={color.orange}  onPress={this.forget}/>
              </View> 
              </>
              : null
            }

            {
              this.state.step == 1 ?
              <>
              <View style={formContainer}>
                {/* <FloatingInput
                  margin={ms(9)}
                  width={ms(250)} 
                  keyboardType={'number-pad'}
                  label={'Verification Code'} 
                  value={this.state.code}
                  onChangeText={text => {
                    this.setState({ code: text });
                  }}
                /> */}
                <OTPInputView
                  style={{height: 50, borderColor:'#000'}}
                  pinCount={4}
                  autoFocusOnLoad
                  codeInputFieldStyle={underlineStyleBase}
                  codeInputHighlightStyle={underlineStyleHighLighted}
                  onCodeChanged = {code => { this.setState({code: code})}}
                  onCodeFilled = {(code => {
                    console.log(`Code is ${code}, you are good to go!`);
                    this.setState({code: code},()=> {
                      this.verifyCode();
                    })
                  })}
                />
              </View>
              {
                this.state.error != '' ?
                <Text style={{textAlign: 'justify',justifyContent: 'center',color: 'red', marginBottom:20}}>{this.state.error}</Text>:null
              }
              <View>
                <Button btnName={'Verify Code'} btnColor={color.orange}  onPress={this.verifyCode}/>
              </View> 
              </>
              : null
            }
            {
              this.state.step == 2 ?
              <>
              <View style={{marginTop:30, width:'90%'}}>
                <FloatingInput
                  secureTextEntry
                  margin={ms(10)}
                  width={'95%'} 
                  label={'New Password'} 
                  value={this.state.password}
                  onChangeText={text => {
                    this.setState({ password: text });
                  }}
                />
                <FloatingInput
                  secureTextEntry
                  margin={ms(10)}
                  width={'95%'} 
                  label={'Confirm Password'} 
                  value={this.state.password_confirmation}
                  onChangeText={text => {
                    this.setState({ password_confirmation: text });
                  }}
                />
              </View>
              {
                this.state.error != '' ?
                <Text style={{textAlign: 'justify',justifyContent: 'center',color: 'red', marginBottom:20}}>{this.state.error}</Text>:null
              }
              <View style={{marginVertical:20}}>
                <Button btnName={'Reset Password'} btnColor={color.orange}  onPress={this.reset}/>
              </View> 
              </> : null
            }
          </View>

          <View style={horizontal}>
            <Spinner 
              textContent={'Loading...'}
              animation='fade'
              textStyle={spinnerTextStyle}
              visible={this.state.showSpinner}
            />
          </View>
          <Dialog.Container visible={this.state.showAlert} >
            <Dialog.Title>{this.state.errorTitle}</Dialog.Title>
            <Dialog.Description>
              {this.state.errorMsg}
            </Dialog.Description>
            <Dialog.Button color="#58c4b7" bold label="Okay" onPress={this.handleCancel.bind(this)} />
          </Dialog.Container>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = ScaledSheet.create({
  mainContainer:{
    flexDirection:'column',
    justifyContent:'flex-start',
    alignItems:'center',
    height: deviceHeight,
    backgroundColor:color.ligth
  },
  imageContainer:{
    width:130,
    height:130,
    borderWidth:3,
    borderColor:color.ligthGrey,
    borderRadius:500,
    justifyContent:'center',
    alignItems:'center',
    marginTop:50
  },
  formContainer:{
    marginTop:50,
    marginBottom:20,
    width:deviceWidth,
    alignItems:'center'
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  horizontal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  underlineStyleBase: {
    width: 50,
    height: 50,
    color:'#000',
    borderColor:'#000',
    fontSize:18,
    margin:20
  },
 
  underlineStyleHighLighted: {
    borderColor: color.orange,
  },
});