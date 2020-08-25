import React, { Component } from 'react';
import { View, Image, ScrollView, Text, Dimensions, TouchableOpacity, AsyncStorage, Alert } from "react-native";

import { images, color } from '../../constants/theme';
import { FloatingInput, Button } from '../common';

import { RNCamera } from 'react-native-camera';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from "react-native-dialog";
import axios from 'axios';
import { ScaledSheet, ms } from 'react-native-size-matters';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const {height: deviceHeight, width: deviceWidth} = Dimensions.get('screen');

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
      <Text style={{color:'#fff'}}>Initializing camera...</Text>
  </View>
);

export default class Signup extends Component {

  constructor(props){
    super(props);
    this.state = {
      name:'hello',
      image:'',
      email:'hello@hello.com',
      password:'hello1',
      password_confirmation:'hello1',
      device_token:'123456',
      device_type:'android',
      isError:false,
      error: '',
      showSpinner:false,
      showAlert:false,
      errorMsg:'',
      errorTitle:'',
      picture:'',
      showCamera:false,
      pictureBase64:''
    }
  }

  openCamera = () => {
    this.setState({showCamera: !this.state.showCamera});
  }

  takePicture = async() => {
    console.log('takePictureFnc')
    // if(this.camera) {
    const options = { quality: 0.1, base64: false };
    const data = await this.camera.takePictureAsync(options);
    console.log(data.uri);
    this.resize(data.uri);
    this.setState({ showCamera: !this.state.showCamera});
    // }
  };

  resize(picture) {
    ImageResizer.createResizedImage(picture, 500, 400, 'JPEG', 100, 0, RNFS.DocumentDirectoryPath)
    .then(({uri}) => {
      this.setState({picture: uri});
      console.log(this.state.picture)
      // this.convertToBase64(uri);
    })
    .catch(err => {
      console.log(err);
      return Alert.alert(
        'Unable to resize the photo',
        // 'Check the console for full the error message',
      );
    });
  }

  // convertToBase64 = async(uri) => {
  //   const base64 = await RNFS.readFile(uri, 'base64');
  //   this.setState({pictureBase64: base64});
  // }

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
        // image:this.state.picture,
        email:this.state.email, 
        password:this.state.password,
        password_confirmation:this.state.password_confirmation, 
        device_token:this.state.device_token, 
        device_type:this.state.device_type
      };
      // var formData = new FormData();
      // formData.append('name', this.state.name);
      // formData.append('email', this.state.email);
      // formData.append('password', this.state.email);
      // // formData.append('password_confirmation', this.state.password_confirmation);
      // formData.append('device_token', this.state.device_token);
      // formData.append('device_type', this.state.device_type);
      // formData.append('image', {
      //   uri:this.state.picture,
      //   name:'profile.jpg',
      //   type:'image/jpg'
      // });
      
      axios.post('https://kanztainer.com/goodyz/api/v1/register', data).then(
        async(res)=> {
          console.log(res.data.data.user);
          console.log(res.data.success);
          this.setState({showSpinner:false});
          if(res.data.success == true) {
            try {
              const userState = await AsyncStorage.setItem('isUserLogedIn', 'true');
              const userData = await AsyncStorage.setItem('userData', JSON.stringify(res.data.data.user));
              const access_token = await AsyncStorage.setItem('access_token',res.data.data.user.access_token);
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
            console.log(res.data)
            this.setState({showAlert:true, errorMsg:'Wrong username or password.', errorTitle:'Error!!'})
          }
        }
      ).catch(
        (error)=> {
          this.setState({showSpinner: false});
          console.log('error', error);
          // this.setState({showAlert:true, errorMsg: error, errorTitle:'Error!!'})
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
        {this.state.showCamera?
        <RNCamera
          ref={ref => {
              this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        >
          {({ camera, status }) => {
            if (status !== 'READY') return <PendingView />;
            return (
              <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity onPress={this.takePicture} style={styles.capture}>
                  <Text style={{ fontSize: 14 }}> SNAP </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </RNCamera>
        :
        <View style={mainContainer}>
          <TouchableOpacity activeOpacity={0.5} style={{position:'absolute', left:10, top:10}} onPress={()=> this.props.navigation.pop()}>
            <FontAwesomeIcon icon={faChevronLeft} size={20} color={color.darkGrey} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.5} onPress={this.openCamera}>
            <View style={imageContainer}>
            {
              this.state.picture == '' ?
              <Image source={images.logo} resizeMode={'contain'} style={{width:100, height:100}}/>
              :
              <Image source={{uri:this.state.picture}} resizeMode={'cover'} style={{width:130, height:130, borderRadius:500,}}/>
            }
            </View>
          </TouchableOpacity>
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
        }
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
  },
  preview: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    height:deviceHeight,
    // zIndex:999
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    // paddingHorizontal: 10,
    alignSelf: 'center',
    margin: 80,
  },
});