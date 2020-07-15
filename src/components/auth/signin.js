import React, { Component } from 'react';
import { View, Image, ScrollView, Text, Dimensions, AsyncStorage } from "react-native";

import { images, color } from '../../constants/theme';
import { FloatingInput, Button } from '../common';

import { ScaledSheet, ms } from 'react-native-size-matters';
import Toast from 'react-native-easy-toast';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';


const {height: deviceHeight, width: deviceWidth} = Dimensions.get('screen');

export default class Signin extends Component {

  constructor(props){
    super(props);
    this.state = {
      username:'',
      password:'',
      refs: undefined,
      error: '',
    }
  }

  login = async() => {
    if (this.state.refs !== undefined) {
      this.state.refs.isError = false;
    }

    if (!this.state.username) {
      this.setState({
        error: 'Please Enter Username',
        refs: this.erUsername
      });
      this.erUsername.isError = true;
    }
    else if (!this.state.password) {
      this.setState({
        error: 'Please Enter Password',
        refs: this.erPassword
      });
      this.erPassword.isError = true;
    }
    else {
      if (this.state.username == 'user' || this.state.username == 'shop') {
        try {
          const userState = await AsyncStorage.setItem('isUserLogedIn', 'true');
          const userType = await AsyncStorage.setItem('userType', this.state.username);
          // const resetAction = StackActions.reset({
          //   index: 0,
          //   key: null,
          //   actions: [NavigationActions.navigate({ routeName: 'QrcodeCmp' })],
          // });
          // this.props.navigation.dispatch(resetAction);
          if(this.state.username == 'user')
            this.props.navigation.navigate('Tabs')
          else
            this.props.navigation.navigate('TabsShop')
        }
        catch(e){
          console.log(e)
        }
      }
      else {
        this.setState({
          error: 'Only enter shop or user in username field.',
          refs: this.erUsername
        });
        this.erPassword.isError = true;
      }
      // this.props.navigation.navigate('Tabs');
      
      // this.setState({visible:true, error:''})
      // var postData = {
      //   Email: this.state.email,
      //   Password: this.state.password
      // };

      // axios.post('http://app.talkthetaste.com/api/login',postData, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'token': 'ttt@9500',
      //   },      
      // })      
      // .then(async(response) => {
      //   this.setState({visible:false})
      //   console.log('response',response.data)
      //   await AsyncStorage.setItem('userId', response.data.userDetails.UserId.toString())
      //   this.props.navigation.navigate('Signup');
      // })
      // .catch((error) => {
      //   this.setState({visible:false})
      //   console.log('error',error)
      //   this.refs.toast.show(error.response.data.message, 100, () => {
          
      //   })
      // })
    }
  }

  signup = () => {
    this.props.navigation.navigate('Signup');
  }

  back = () => {
    this.props.navigation.navigate('QrCode');
  }

  render(){
    const { mainContainer, imageContainer, formContainer } = styles;

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
              label={'Name'} 
              value={this.state.username}
              ref={ref => this.erUsername = ref}
              onChangeText={text => {
                  this.setState({ username: text });
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
  }
});