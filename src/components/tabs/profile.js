import React, {Component} from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, AsyncStorage } from 'react-native';

import { color, images } from '../../constants/theme';

import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from "react-native-dialog";
import axios from 'axios';
import {ScaledSheet, ms} from 'react-native-size-matters';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faKey, faTrash, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const { height:deviceHeigth, width:deviceWidth } = Dimensions.get('screen');

export default class ProfileCmp extends Component {

  static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: (
				<View style={{width:'100%', justifyContent:'center', alignItems:'center', backgroundColor:color.primary, flexDirection:'row'}}>
					<Text style={{fontSize: 20, color:color.dark}}>Profile</Text>
        </View>
			),
			headerTitleStyle: { flex: 1, textAlign: "center" },
			headerStyle: {
				backgroundColor: color.primary
      },
      headerRight:(
        <TouchableOpacity style={{marginRight:10}} activeOpacity={0.5} onPress={()=>navigation.navigate('EditProfileCmp')}>
          <Text style={{color:color.blue}}>Edit</Text>
        </TouchableOpacity>
      ),
      headerLeft:(<></>)
		// };
		// title: 'Dashboard',
		// headerTintColor: theme.color.ligth,
		// headerStyle: {
		//   backgroundColor: theme.color.primary, flex: 1, textAlign: "center"
		}
  };
  
  constructor(props){
    super(props);
    this.state = {
      showSpinner:false,
      showAlert:false,
    }
  }

  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", async() => {
      const isUserLogedIn = await this.checkUserLoggedIn();
      console.log('isUserLogedIn', isUserLogedIn)
      if(!isUserLogedIn){
        this.props.navigation.pop();
        this.props.navigation.navigate('Signin');
      }
      console.log(isUserLogedIn);
    });
  }

  checkUserLoggedIn = async () => {
    try {
      const value = await AsyncStorage.getItem('isUserLogedIn')
      if(value == null || value == false)
        return false;
      else
        return true;
    } 
    catch(e) {
      console.log(e);
    }
  }

  handleCancel() {
    this.setState({showAlert:false});
  }

  logout = async() => {
    this.setState({showSpinner:true});
    const user_access_token = await AsyncStorage.getItem('access_token');
    let access_token = {
      headers: {
        'Authorization': 'Bearer '+user_access_token
      }
    };
    axios.post('https://kanztainer.com/goodyz/api/v1/logout', {}, access_token).then(
      async(res)=> {
        console.log(res.data);
        this.setState({showSpinner:false});
        await AsyncStorage.removeItem('isUserLogedIn');
        await AsyncStorage.removeItem('userType');
        await AsyncStorage.removeItem('userData');
        this.props.navigation.navigate('QrCode');
      }
    ).catch(
     async  (error)=> {
        this.setState({showSpinner: false});
        console.log('error', error);
        await AsyncStorage.removeItem('isUserLogedIn');
        await AsyncStorage.removeItem('userType');
        await AsyncStorage.removeItem('userData');
        this.props.navigation.navigate('QrCode');
        this.setState({showAlert:true, errorMsg:'Something went wrong.'+error, errorTitle:'Error!!'})
      }
    );
  }

  render(){
    const { mainContainer, profilePicture, profileName, profileEmail, hrLine, horizontal, spinnerTextStyle } = styles;

    return(
      <View style={mainContainer}>
        <Image style={profilePicture} source={images.profilePicture} />
        <Text style={profileName}>Mitchell Williamson</Text>
        <Text style={profileEmail}>pamela.foster@example.com</Text>
        <Text style={profileEmail}>(843) 555-0130</Text>
        <Text style={hrLine}></Text>
        <View style={{marginTop:30, width:'90%'}}>
          <TouchableOpacity activeOpacity={0.5} onPress={()=> this.props.navigation.navigate('ChangePasswordCmp')}>
            <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center', marginBottom:20}}>
              <FontAwesomeIcon icon={faKey} size={20} color={color.darkGrey} />
              <Text style={{marginLeft:20, fontSize:18, color:color.blue}}>Change Password</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5}>
            <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center', marginBottom:20}}>
              <FontAwesomeIcon icon={faTrash} size={20} color={color.darkGrey} />
              <Text style={{marginLeft:20, fontSize:18, color:color.blue}}>Delete Account</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} onPress={this.logout}>
            <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center', marginBottom:20}}>
              <FontAwesomeIcon icon={faSignOutAlt} size={20} color={color.darkGrey} />
              <Text style={{marginLeft:20, fontSize:18, color:color.orange}}>Logout</Text>
            </View>
          </TouchableOpacity>
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
  profilePicture:{
    height:100,
    width:100,
    marginTop:30,
    borderRadius:50
  },
  profileName:{
    fontSize:18,
    marginTop:20
  },
  profileEmail:{
    fontSize:16,
    marginTop:5
  },
  hrLine:{
    borderBottomColor:color.ligthGrey,
    borderBottomWidth:2,
    width:'90%'
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