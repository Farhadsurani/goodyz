import React, {Component} from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, AsyncStorage, FlatList, ScrollView } from 'react-native';

import { ImageCard } from '../common';
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
      userData:'',
      today_events:[]
    }
  }

  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", async() => {
      const isUserLogedIn = await this.checkUserLoggedIn();
      // console.log('isUserLogedIn', isUserLogedIn)
      if(!isUserLogedIn){
        this.props.navigation.pop();
        this.props.navigation.navigate('Signin');
      }
      else 
        this.refreshUser();
    });
  }

  checkUserLoggedIn = async () => {
    try {
      const value = await AsyncStorage.getItem('isUserLogedIn')
      if(value == null || value == false)
        return false;
      else{
        const user = await AsyncStorage.getItem('userData');
        this.setState({userData: JSON.parse(user), today_events:JSON.parse(user).today_events});
        return true;
      }
    } 
    catch(e) {
      console.log(e);
    }
  }

  async refreshUser() {
    const user_access_token = await AsyncStorage.getItem('access_token');
    let access_token = {
      headers: {
        'Authorization': 'Bearer '.concat(user_access_token)
      }
    };
    const url = 'https://kanztainer.com/goodyz/api/v1/me';
    axios.post(url, {}, access_token).then(async(res)=> {
      console.log('res.data.data.today_events');
      console.log(res.data.data.today_events);
      await AsyncStorage.setItem('userData', JSON.stringify(res.data.data));
      this.setState({userData: res.data.data, today_events:res.data.data.today_events});
      console.log('this.state.today_events');
      console.log(this.state.today_events);
    }).catch((error)=> {
      console.log('error', error);
    });
  }

  handleCancel() {
    this.setState({showAlert:false});
  }

  logout = async() => {
    this.setState({showSpinner:true});
    const user_access_token = await AsyncStorage.getItem('access_token');
    let access_token = {
      headers: {
        'Authorization': 'Bearer '.concat(user_access_token)
      }
    };
    axios.post('https://kanztainer.com/goodyz/api/v1/logout', {}, access_token).then(
      async(res)=> {
        console.log(res.data);
        this.setState({showSpinner:false});
        await AsyncStorage.removeItem('isUserLogedIn');
        await AsyncStorage.removeItem('userType');
        await AsyncStorage.removeItem('userData');
        await AsyncStorage.removeItem('access_token');
        this.props.navigation.navigate('QrCode');
      }
    ).catch(
     async (error)=> {
        this.setState({showSpinner: false});
        console.log('error', error);
        await AsyncStorage.removeItem('isUserLogedIn');
        await AsyncStorage.removeItem('userType');
        await AsyncStorage.removeItem('userData');
        await AsyncStorage.removeItem('access_token');
        this.props.navigation.navigate('QrCode');
        // this.setState({showAlert:true, errorMsg:'Something went wrong.'+error, errorTitle:'Error!!'})
      }
    );
  }

  renderHeader = () => {
    const { profilePicture, profileName, profileEmail, hrLine } = styles;
    return (
      <View style={{ width:deviceWidth-20, alignItems:'center' }} >
        {
          this.state.userData != '' ?
          <>
            <Image style={profilePicture} source={{uri:this.state.userData.details.image_url}} />
            <Text style={profileName}>{this.state.userData.name}</Text>
            <Text style={profileEmail}>{this.state.userData.email}</Text>
            {/* <Text style={profileEmail}>(843) 555-0130</Text> */}
          </>
          :
          null
        }
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
      </View>
    )
  }

  renderData = (item) => {
    const { cardContainer } = styles;
    return(
      <View style={cardContainer}>
        <ImageCard 
          logo={{uri:item.item.event.logo_url}} 
          text={item.item.event.name}
          bigImage={{uri:item.item.event.banner_image_url}}
          isRedeemed={item.item.event.is_redeemed}
          onPress={() => this.detail(item.item.event)}
          isDetail={false}
          description={item.item.event.description}
          height={200}
        />
      </View>
    )
  }
  
  detail(data) {
    this.props.navigation.navigate('GoodyzListCmp', {data: data.offers});
  }

  render(){
    const { mainContainer, horizontal, spinnerTextStyle } = styles;

    return(
      <View style={mainContainer}>
        <FlatList
          ListHeaderComponent= {this.renderHeader}
          data={this.state.today_events}
          renderItem={this.renderData}
          keyExtractor={(item, index) => index.toString()}
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
    backgroundColor:color.ligth,
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
  },
  cardContainer:{
    backgroundColor:color.ligth,
    marginBottom:20,
    justifyContent:'center',
    alignItems:'center'
  },
})