import React, {Component} from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView, AsyncStorage, Modal } from 'react-native';

import { color, images } from '../../constants/theme';
import { FloatingInput } from '../common'

import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from "react-native-dialog";
import axios from 'axios';
import ImageResizer from 'react-native-image-resizer'
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-picker';
import { RNCamera } from 'react-native-camera';
import { ScaledSheet, ms } from 'react-native-size-matters';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faChevronLeft, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const { height:deviceHeigth, width:deviceWidth } = Dimensions.get('screen');

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

const options = {
  title: 'Select Profile Picture',
  customButtons: [{ name: 'Select', title: 'Choose Photo from gallery' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

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
      errorMsg:'',
      picture:'',
      showCamera:false,
      pictureBase64:'',
      modalVisible: false,
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

  openCamera = () => {
    this.setState({showCamera: !this.state.showCamera, modalVisible:false});
	}

  openGallery = () => {
    this.setState({modalVisible: false});
    setTimeout(()=> {
      this.chooseImage();
    }, 100)
	}
	
	chooseImage = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.resize(response.uri)
      }
    });
  }

  takePicture = async() => {
    const options = { quality: 0.1, base64: true };
    const data = await this.camera.takePictureAsync(options);
    this.resize(data.uri);
    this.setState({ showCamera: !this.state.showCamera});
  };

  resize = async(picture) => {
    ImageResizer.createResizedImage(picture, 500, 400, 'JPEG', 100)
    .then(({uri}) => {
      console.log('resize function URI: ', uri)
      this.setState({picture:uri});
    })
    .catch(err => {
        console.log(err);
        return Alert.alert(
          'Unable to resize the photo',
        );
    });
  }

  selectPicture = () => {
		console.log('this.selectPicture')
    this.setState({modalVisible: true});
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
      
      const formData = new FormData();
      formData.append('name', this.state.name);
      formData.append('email', this.state.email);
      formData.append('image',{
        uri:this.state.picture,
        name:'profilePicture.jpg',
        type:'image/jpg'
      });

      this.setState({showSpinner:true});

      axios.put(url, formData, access_token).then((res)=> {
        this.refreshUser();
        this.setState({showSpinner:false});
        console.log(res.data);
      }).catch((error)=> {
        this.setState({showSpinner:false});
        console.log('error', error);
        this.setState({showAlert:true, errorMsg:'Something went wrong. '+error, errorTitle:'Error!!'});
      });
    }
    
  };

  async refreshUser() {
    const user_access_token = await AsyncStorage.getItem('access_token');
    let access_token = {
      headers: {
        'Authorization': 'Bearer '.concat(user_access_token)
      }
    };
    const url = 'https://kanztainer.com/goodyz/api/v1/me';
    axios.post(url, {}, access_token).then(async(res)=> {
      console.log(res.data.data);
      await AsyncStorage.setItem('userData', JSON.stringify(res.data.data));
      this.props.navigation.pop();
    }).catch((error)=> {
      console.log('error', error);
    });
  }

  render(){
    const { mainContainer, profilePicture, spinnerTextStyle, horizontal, imageContainer } = styles;

    return(
      this.state.showCamera?
      <RNCamera
        ref={ref => {this.camera = ref}}
        style={styles.preview}
        type={RNCamera.Constants.Type.front}
        flashMode={RNCamera.Constants.FlashMode.on}
        captureAudio={false}
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
            <TouchableOpacity activeOpacity={0.5} onPress={this.takePicture} style={styles.capture}>
              <Text style={{ fontSize: 14, fontFamily:'JosefinSans-Regular' }}> SNAP </Text>
            </TouchableOpacity>
        </View>
        );
      }}
      </RNCamera>
      :
      <ScrollView>
        <Modal
          animationType="fade"
          transparent={true}
          hardwareAccelerated={true}
          visible={this.state.modalVisible}
        >
					<View style={{height:'100%', width:'100%', justifyContent:'center', alignContent:'center', alignItems:'center', backgroundColor:'#24242457'}}>
            <View style={{
                flexDirection:'row', 
                height:150, 
                width:'80%', 
                backgroundColor:'#fff', 
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.23,
                shadowRadius: 2.62,
                elevation: 4,
                justifyContent:'center',
                alignItems:'center'
              }}
            >	
							<View style={{width:'100%', height:20, position:'absolute', top:5, right:5, alignItems:'flex-end'}}>
								<TouchableOpacity activeOpacity={0.5} onPress={()=> this.setState({modalVisible:false})}>
									<FontAwesomeIcon icon={faTimesCircle} size={20} color={color.dark} />
								</TouchableOpacity>
							</View>
              <View style={{alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                <TouchableOpacity activeOpacity={0.5}
                  style={{alignItems:'center', justifyContent:'center', height:70, width:70, backgroundColor:'#2424249e', borderRadius:70, marginHorizontal:20}}
                  onPress={() => this.openCamera()}>
                    <Image
                      source={images.cameraIcon}
                      style={{ width: 40, height: 40 }}
                      resizeMode="cover"
                    />
                </TouchableOpacity>
                <Text style={{marginTop:5, fontSize:18}}>Camera</Text>
              </View>
              <View style={{alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                <TouchableOpacity activeOpacity={0.5}
                  style={{alignItems:'center', justifyContent:'center', height:70, width:70, backgroundColor:'#2424249e', borderRadius:70, marginHorizontal:20}}
                  onPress={() => this.openGallery()}>
                    <Image
                      source={images.galleryIcon}
                      style={{ width: 40, height: 40 }}
                      resizeMode="cover"
                    />
                </TouchableOpacity>
                <Text style={{marginTop:5, fontSize:18}}>Gallery</Text>
              </View>
            </View>
          </View>
        </Modal>
        <View style={mainContainer}>
          {/* <View>
            <Image style={profilePicture} source={images.profilePicture} />
            <TouchableOpacity activeOpacity={0.8} style={{position:'absolute', bottom:0, right:0, backgroundColor:color.ligth, height:30, width:30, alignItems:'center', justifyContent:'center', borderRadius:50, elevation:5}}>
              <FontAwesomeIcon icon={faCamera} size={20} color={color.dark} />
            </TouchableOpacity>
          </View> */}
          <TouchableOpacity activeOpacity={0.5} onPress={this.selectPicture}>
            <View style={imageContainer}>
            {
              this.state.picture == '' ?
              <Image source={images.profilePicture} resizeMode={'contain'} style={{width:100, height:100}}/>
              :
              <Image source={{uri:this.state.picture}} resizeMode={'cover'} style={{width:130, height:130, borderRadius:500,}}/>
            }
            </View>
          </TouchableOpacity>
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
  preview: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    height:Dimensions.get('screen').height,
    // zIndex:999
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    // paddingHorizontal: 10,
    alignSelf: 'center',
    margin: 130,
  }
})