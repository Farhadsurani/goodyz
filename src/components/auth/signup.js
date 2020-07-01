import React, { Component } from 'react';
import { View, Image, ScrollView, Text, Dimensions, TouchableOpacity } from "react-native";

import { images, color } from '../../constants/theme';
import { FloatingInput, Button } from '../common';

import { ScaledSheet, ms } from 'react-native-size-matters';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const {height: deviceHeight, width: deviceWidth} = Dimensions.get('screen');

export default class Signup extends Component {

  constructor(props){
    super(props);
    this.state = {
      username:'',
      password:'',
      confirmPassword:''
    }
  }
    
  signup = () => {
    console.log('signup')
  }

  render(){
    const { mainContainer, imageContainer, formContainer } = styles;

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
              keyboardType={'email-address'}
              label={'Name'} 
              value={this.state.username}
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
              onChangeText={text => {
                this.setState({ password: text });
              }}
            />

            <FloatingInput
              margin={ms(10)}
              width={ms(250)} 
              label={'Confirm Password'} 
              secureTextEntry
              value={this.state.confirmPassword}
              onChangeText={text => {
                this.setState({ confirmPassword: text });
              }}
            />
          </View>

          <View style={{marginTop:50}}>
            <Button btnName={'Signup'} btnColor={color.orange}  onPress={this.signup} />
          </View>
        </View>
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