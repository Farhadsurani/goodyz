import React, {Component} from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, AsyncStorage } from 'react-native';

import { color, images } from '../../constants/theme';
import { FloatingInput } from '../common'

import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from "react-native-dialog";
import axios from 'axios';
import {ScaledSheet, ms} from 'react-native-size-matters';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const { height:deviceHeigth, width:deviceWidth } = Dimensions.get('screen');

export default class ChangePasswordCmp extends Component {

  static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: (
				<View style={{width:'100%', justifyContent:'center', alignItems:'center', backgroundColor:color.primary, flexDirection:'row'}}>
					<Text style={{fontSize: 20, color:color.dark}}>Change Password</Text>
        </View>
			),
			headerTitleStyle: { flex: 1, textAlign: "center" },
			headerStyle: {
				backgroundColor: color.primary
      },
      headerRight:(
        <TouchableOpacity style={{marginRight:10}} activeOpacity={0.5} onPress={()=> navigation.getParam('popScreen')()}>
          <Text style={{color:color.blue}}>Done</Text>
        </TouchableOpacity>
      ),
      headerLeft:(
        <TouchableOpacity activeOpacity={0.5} style={{marginLeft:10}} onPress={()=> navigation.pop()}>
          <FontAwesomeIcon icon={faChevronLeft} size={20} color={color.dark} />
        </TouchableOpacity>
      )
		}
  };
  
  constructor(props) {
    super(props);
    this.props.navigation.setParams({
      popScreen: this.popScreen,
    });

    this.state = {
      current_password:'',
      password:'',
      password_confirmation:'',
      showSpinner:false,
      showAlert:false,
    }
  }

  popScreen = async() => {
    if (this.state.refs !== undefined) {
      this.state.refs.isError = false;
    }

    if(!this.state.current_password) {
      this.setState({
        error:'Please enter your current password',
        refs:this.erCurrent_password
      });
      this.erCurrent_password.isError = true;
    }
    else if(!this.state.password) {
      this.setState({
        error:'Please enter your new password',
        refs:this.erPassword
      });
      this.erPassword.isError = true;
    }
    else if(!this.state.password_confirmation) {
      this.setState({
        error:'Please enter your confirm password',
        refs:this.erPassword_confirmation
      });
      this.erPassword_confirmation.isError = true;
    }
    else if(this.state.password_confirmation != this.state.password) {
      this.setState({
        error:'Password not matched.',
        refs:this.erPassword_confirmation
      });
      this.erPassword_confirmation.isError = true;
    }
    else if(this.state.password_confirmation.length < 6 || this.state.password.length < 6 ) {
      this.setState({
        error:'Password must be 6 charactors long.',
        refs:this.erPassword_confirmation
      });
      this.erPassword_confirmation.isError = true;
    }
    else {
      const userData = await AsyncStorage.getItem('userData');
      const access_token = JSON.parse(userData).access_token;
      const AuthStr = 'Bearer '.concat(access_token); 
      console.log(AuthStr)
      const url = 'https://kanztainer.com/goodyz/api/v1/change-password?current_password='+this.state.current_password+'&password='+this.state.password+'&password_confirmation='+this.state.password_confirmation;
      this.setState({showSpinner:true});

      axios.post(url, { headers: { 'Authorization': AuthStr } }).then((res)=> {
        this.setState({showSpinner:false});
        console.log(res.data);
        this.setState({showAlert:true, errorMsg:'Password changed successfuly.', errorTitle:'Success'});
        setTimeout(()=> {
          this.props.navigation.pop();
        }, 2000)
      }).catch((error)=> {
        this.setState({showSpinner:false});
        console.log('error', error);
        this.setState({showAlert:true, errorMsg:'Wrong Password. '+error, errorTitle:'Error!!'});
      });
    }
    // this.props.navigation.pop();
  };

  handleCancel() {
    this.setState({showAlert:false});
  }

  render(){
    const { mainContainer, spinnerTextStyle, horizontal} = styles;

    return(
      <View style={mainContainer}>
        <View style={{marginTop:30, width:'90%'}}>
          <FloatingInput
            margin={ms(10)}
            width={'95%'} 
            label={'Old Password'} 
            value={this.state.current_password}
            ref={ref => this.erCurrent_password = ref}
            onChangeText={text => {
              this.setState({ current_password: text });
            }}
          />
          <FloatingInput
            margin={ms(10)}
            width={'95%'} 
            label={'New Password'} 
            value={this.state.password}
            ref={ref => this.erPassword = ref}
            onChangeText={text => {
              this.setState({ password: text });
            }}
          />
          <FloatingInput
            margin={ms(10)}
            width={'95%'} 
            label={'Confirm Password'} 
            value={this.state.password_confirmation}
            ref={ref => this.erPassword_confirmation = ref}
            onChangeText={text => {
              this.setState({ password_confirmation: text });
            }}
          />
        </View>

        <View style={{marginTop:20}} ref={ref => this.error = ref}>
          <Text style={{textAlign: 'justify',justifyContent: 'center',color: 'red',}}>{this.state.error}</Text>
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

      </View>
    )
  }
}

const styles = ScaledSheet.create({
  mainContainer:{
    flexDirection:'column',
    justifyContent:'flex-start',
    alignItems:'center',
    height: deviceHeigth,
    padding:10,
    backgroundColor:color.ligth
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