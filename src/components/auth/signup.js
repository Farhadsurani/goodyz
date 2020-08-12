import React, { Component } from 'react';
import { View, Image, ScrollView, Text, Dimensions, TouchableOpacity, AsyncStorage } from "react-native";

import { images, color } from '../../constants/theme';
import { FloatingInput, Button } from '../common';

import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from "react-native-dialog";
import axios from 'axios';
import { ScaledSheet, ms } from 'react-native-size-matters';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const {height: deviceHeight, width: deviceWidth} = Dimensions.get('screen');

export default class Signup extends Component {

  constructor(props){
    super(props);
    this.state = {
      name:'Mudassir',
      image:'',
      email:'mudassir@gmail.com',
      password:'123456',
      password_confirmation:'123456',
      device_token:'123456',
      device_type:'android',
      isError:false,
      error: '',
      showSpinner:false,
      showAlert:false,
      errorMsg:'',
      errorTitle:'',
    }
  }

  signup = async() => {
    this.setState({isError:false});

    if (!this.state.name) {
      this.setState({
        error: 'Please Enter Full Name',
        isError: true
      });
    }
    else if (!this.state.password) {
      this.setState({
        error: 'Please Enter Password',
        isError: true
      });
    }
    else if (!this.state.password_confirmation) {
      this.setState({
        error: 'Please Enter Confirm Password',
        isError: true
      });
    }
    else if (this.state.password.length < 6) {
      this.setState({
        error: 'The password must be at least 6 characters',
        isError: true
      });
    }
    else if (!this.state.email) {
      this.setState({
        error: 'Please Enter Email',
        isError: true
      });
    }
    else if (this.state.password_confirmation != this.state.password) {
      this.setState({
        error: 'Password & Confirm Password must match',
        isError: true
      });
    }

    else {
      this.setState({showSpinner:true});
      const data = {
        name:this.state.name, 
        // image:this.state.image, 
        email:this.state.email, 
        password:this.state.password,
        password_confirmation:this.state.password_confirmation, 
        device_token:this.state.device_token, 
        device_type:this.state.device_type
      };
      console.log(data);
      axios.post('https://kanztainer.com/goodyz/api/v1/register', data).then(
        async(res)=> {
          console.log(res.data.data.user);
          console.log(res.data.success);
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
        }
      ).catch(
        (error)=> {
          this.setState({showSpinner: false});
          console.log('error', error);
        }
      );
    }
  }

  handleCancel() {
    this.setState({showAlert:false});
  }

  render(){
    const { mainContainer, imageContainer, formContainer, horizontal, spinnerTextStyle } = styles;

    return(
      <ScrollView>
        <View style={mainContainer}>
          <TouchableOpacity activeOpacity={0.5} style={{position:'absolute', left:10, top:10}} onPress={()=> this.props.navigation.pop()}>
            <FontAwesomeIcon icon={faChevronLeft} size={20} color={color.darkGrey} />
          </TouchableOpacity>
          <View style={imageContainer}>
            <Image source={images.logo} resizeMode={'contain'} style={{width:100, height:100}}/>
          </View>
          
          <Text style={{marginTop:10, fontSize:ms(30), fontWeight:'bold'}}>Signup</Text>

          <View style={formContainer}>
            <FloatingInput
              margin={ms(9)}
              width={ms(250)} 
              label={'Name'} 
              value={this.state.name}
              onChangeText={text => {
                this.setState({ name: text });
              }}
            />

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

            <FloatingInput
              margin={ms(10)}
              width={ms(250)} 
              label={'Password'} 
              secureTextEntry
              value={this.state.password}
              onChangeText={text => {
                this.setState({ password: text });
              }}
            />

            <FloatingInput
              margin={ms(10)}
              width={ms(250)} 
              label={'Confirm Password'} 
              secureTextEntry
              value={this.state.password_confirmation}
              onChangeText={text => {
                this.setState({ password_confirmation: text });
              }}
            />
          </View>
          
          {
            this.state.isError ?
            <View style={{marginTop:20}}>
              <Text style={{textAlign: 'justify',justifyContent: 'center',color: 'red',}}>{this.state.error}</Text>
            </View>
            :
            null
          }
          
          <View style={{marginTop:50}}>
            <Button btnName={'Signup'} btnColor={color.orange}  onPress={this.signup} />
          </View>
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