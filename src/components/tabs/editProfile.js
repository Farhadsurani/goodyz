import React, {Component} from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView, AsyncStorage } from 'react-native';

import { color, images } from '../../constants/theme';
import { FloatingInput } from '../common'

import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from "react-native-dialog";
import axios from 'axios';
import {ScaledSheet, ms} from 'react-native-size-matters';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const { height:deviceHeigth, width:deviceWidth } = Dimensions.get('screen');

export default class EditProfileCmp extends Component {

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
      name:'',
      email:'',
      phone:'',
      userData:'',
      showSpinner:false,
      showAlert:false,
      isError:false,
      errorMsg:''
    }
    
    this.getUser();
  }

  async getUser() {
    const user = await AsyncStorage.getItem('userData');
    const parseUser = JSON.parse(user);
    this.setState({
      userData: parseUser,
      name: parseUser.name,
      email:parseUser.email
    })
  }

  handleCancel() {
    this.setState({showAlert:false});
  }

  popScreen = async() => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if(!this.state.name) {
      this.setState({
        errorMsg:'Please enter your name.',
        isError:true
      });
      setTimeout(()=> {
        this.setState({isError:false, errorMsg:''});
      }, 3000)
    }
    else if(!this.state.email) {
      this.setState({
        errorMsg:'Please enter your email.',
        isError:true
      });
      setTimeout(()=> {
        this.setState({isError:false, errorMsg:''});
      }, 3000)
    }
    else if(!reg.test(this.state.email)) {
      this.setState({
        errorMsg:'Email address is not correct',
        isError:true
      });
      setTimeout(()=> {
        this.setState({isError:false, errorMsg:''});
      }, 3000)
    }
    else {
      const user_access_token = await AsyncStorage.getItem('access_token');
      const access_token = {
        headers: { 
          'Authorization': 'Bearer '.concat(user_access_token)
        }
      };
      const url = 'https://kanztainer.com/goodyz/api/v1/users/'+this.state.userData.id;
      const bodyParameters = {name: this.state.name, email: this.state.email};

      this.setState({showSpinner:true});

      axios.put(url, bodyParameters, access_token).then((res)=> {
        this.setState({showSpinner:false});
        console.log(res.data);
        // this.setState({showAlert:true, errorMsg:'Password changed successfuly.', errorTitle:'Success'});
        setTimeout(()=> {
          this.props.navigation.pop();
        }, 2000)
      }).catch((error)=> {
        this.setState({showSpinner:false});
        console.log('error', error);
        this.setState({showAlert:true, errorMsg:'Something went wrong. '+error, errorTitle:'Error!!'});
      });
    }
    // this.props.navigation.pop();
  };

  render(){
    const { mainContainer, profilePicture, spinnerTextStyle, horizontal } = styles;

    return(
      <ScrollView>
        <View style={mainContainer}>
          <View>
            <Image style={profilePicture} source={images.profilePicture} />
            <TouchableOpacity activeOpacity={0.8} style={{position:'absolute', bottom:0, right:0, backgroundColor:color.ligth, height:30, width:30, alignItems:'center', justifyContent:'center', borderRadius:50, elevation:5}}>
              <FontAwesomeIcon icon={faCamera} size={20} color={color.dark} />
            </TouchableOpacity>
          </View>
        
          <View style={{marginTop:30, width:'90%'}}>
            <FloatingInput
              margin={ms(10)}
              width={'95%'} 
              label={'Name'} 
              value={this.state.name}
              ref={ref => this.erName = ref}
              onChangeText={text => {
                this.setState({ name: text });
              }}
            />
            <FloatingInput
              margin={ms(10)}
              width={'95%'} 
              label={'Email'} 
              value={this.state.email}
              ref={ref => this.erEmail = ref}
              keyboardType={'email-address'}
              onChangeText={text => {
                this.setState({ email: text });
              }}
            />
            {/* <FloatingInput
              margin={ms(10)}
              width={'95%'} 
              label={'Phone'} 
              value={this.state.phone}
              ref={ref => this.erPhone = ref}
              keyboardType={'phone-pad'}
              onChangeText={text => {
                  this.setState({ phone: text });
              }}
            /> */}
            {
              this.state.isError?
              <View style={{marginTop:20}}>
                <Text style={{textAlign:'justify', justifyContent:'center', color:'red'}}>{this.state.errorMsg}</Text>
              </View>
              : null
            }
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