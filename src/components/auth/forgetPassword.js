import React, { Component } from 'react';
import { View, Image, ScrollView, Text, Dimensions, AsyncStorage, TouchableOpacity, SafeAreaView } from "react-native";

import { images, color } from '../../constants/theme';
import { FloatingInput, Button } from '../common';

import { ScaledSheet, ms } from 'react-native-size-matters';
import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from "react-native-dialog";
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';


const {height: deviceHeight, width: deviceWidth} = Dimensions.get('screen');

export default class ForgetPasswordCmp extends Component {

  constructor(props){
    super(props);
    this.state = {
      step:0,
      email:'',
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
        this.setState({showSpinner:false});
      }).catch(
        (error)=> {
          console.log('error', error);
          this.setState({showSpinner:false, showAlert:true, errorMsg:'Email address not found.'+error, errorTitle:'Server Error!!'})
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
    const { mainContainer, imageContainer, formContainer, horizontal, spinnerTextStyle } = styles;

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
    marginBottom:20
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