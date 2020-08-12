import React, { Component } from 'react';
import { View, Image, ScrollView, Text, Dimensions, AsyncStorage, TouchableOpacity } from "react-native";

import { images, color } from '../../constants/theme';
import { FloatingInput, Button } from '../common';

import { ScaledSheet, ms } from 'react-native-size-matters';
import Toast from 'react-native-easy-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from "react-native-dialog";
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';


const {height: deviceHeight, width: deviceWidth} = Dimensions.get('screen');

export default class Signin extends Component {

  constructor(props){
    super(props);
    this.state = {
      email:'admin@boilerplate.com',
      password:'admin123',
      device_type:'android',
      device_token:'123',
      refs: undefined,
      error: '',
      showSpinner:false,
      showAlert:false,
      errorMsg:'',
      errorTitle:'',
    }
  }

  login = async() => {
    if (this.state.refs !== undefined) {
      this.state.refs.isError = false;
    }

    if (!this.state.email) {
      this.setState({
        error: 'Please Enter email',
        refs: this.eremail
      });
      this.eremail.isError = true;
    }
    else if (!this.state.password) {
      this.setState({
        error: 'Please Enter Password',
        refs: this.erPassword
      });
      this.erPassword.isError = true;
    }
    else {
      this.setState({showSpinner:true});
      axios.post('https://kanztainer.com/goodyz/api/v1/login', this.state).then(
      async (res)=> {
        console.log(res.data.data.user);
        console.log(res.data.success)
        this.setState({showSpinner:false});
        if(res.data.success == true) {
          try {
            const userState = await AsyncStorage.setItem('isUserLogedIn', 'true');
            const userData = await AsyncStorage.setItem('userData', JSON.stringify(res.data.data.user));
            this.props.navigation.navigate('Tabs')
            // if(this.state.email == 'user')
            //   this.props.navigation.navigate('Tabs')
            // else
            //   this.props.navigation.navigate('TabsShop')
          }
          catch(e){
            console.log('Error storing user data', e);
            this.setState({showSpinner:false});
          }
        }
        else {
          this.setState({showAlert:true, errorMsg:'Wrong username or password.', errorTitle:'Error!!'})
        }
      }).catch(
        (error)=> {
          console.log('error', error);
          this.setState({showSpinner:false, showAlert:true, errorMsg:'Something went wrong.', errorTitle:'Server Error!!'})
        }
      );
    }
  }

  signup = () => {
    this.props.navigation.navigate('Signup');
  }

  back = () => {
    this.props.navigation.navigate('QrCode');
  }

  handleCancel() {
    this.setState({showAlert:false});
  }

  render(){
    const { mainContainer, imageContainer, formContainer, horizontal, spinnerTextStyle } = styles;

    return(
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
          
          <Text style={{marginTop:10, fontSize:ms(30), fontWeight:'bold'}}>Login</Text>

          <View style={formContainer}>
            <FloatingInput
              margin={ms(9)}
              width={ms(250)} 
              keyboardType={'email-address'}
              label={'Email'} 
              value={this.state.email}
              ref={ref => this.eremail = ref}
              onChangeText={text => {
                  this.setState({ email: text });
              }}
            />
            <FloatingInput
              margin={ms(10)}
              width={ms(250)} 
              label={'Password'} 
              secureTextEntry
              value={this.state.password}
              ref={ref => this.erPassword = ref}
              onChangeText={text => {
                  this.setState({ password: text });
              }}
            />
          </View>
          
          <View style={{marginTop:20}} ref={ref => this.error = ref}>
            <Text style={{textAlign: 'justify',justifyContent: 'center',color: 'red',}}>{this.state.error}</Text>
          </View>
          
          <View>
            <Button btnName={'Login'} btnColor={color.orange}  onPress={this.login}/>
          </View>

          <View style={{marginTop:10, flexDirection:'row', width:ms(250)}}>
            <TouchableOpacity activeOpacity={0.5} style={{alignSelf:'flex-start', width:ms(140)}} onPress={this.signup}>
              <Text style={{color:color.orange}}>Signup</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.5} style={{alignSelf:'flex-end', width:ms(140)}}>
              <Text style={{color:color.orange}}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Toast   
          ref="toast"    
          style={{backgroundColor:'#DCDCDC',width:'80%'}}
          position='bottom'
          positionValue={100}
          fadeInDuration={750}
          fadeOutDuration={2000}
          opacity={0.8}
          textStyle={{color:'#000',textAlign:'center', fontFamily:'JosefinSans-Regular'}}
        />
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
    marginTop:50
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
});