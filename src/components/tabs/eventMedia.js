import React, {Component} from 'react';
import { View, FlatList, ImageBackground, Image, Text, AsyncStorage, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images, color } from '../../constants/theme';
import { data } from '../../constants/data';

import axios from 'axios';
import ActionButton from 'react-native-action-button';
import ImageResizer from 'react-native-image-resizer'
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-picker';
import { RNCamera } from 'react-native-camera';
import { ScaledSheet } from 'react-native-size-matters';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

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

export default class EventMediaCmp extends Component {
	constructor(props){
		super(props);
		this.state = {
			data:[],
			modalVisible: false
		}
	}

	async componentDidMount() {
		const access_token = await AsyncStorage.getItem('access_token');
    const header = {
      headers:{
        'Authorization':'Bearer '.concat(access_token)
      }
    }
		axios.get('https://kanztainer.com/goodyz/api/v1/event/get-media/22', header).then(
			response=> {
				console.log(response.data);
				this.setState({data:response.data.data});
			},
			error => {
				console.log(error)
			}
		);
		// this.selectPicture();
	}

	openCamera = () => {
    this.setState({showCamera: !this.state.showCamera, modalVisible:false});
	}

	openGallery = () => {
    this.chooseImage();
    this.setState({modalVisible: false});
	}
	
	chooseImage = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        // const source = { uri: response.uri };
        this.resize(response.uri)
        console.log('response', JSON.stringify(response));
      }
    });
  }

  takePicture = async() => {
    // if(this.camera) {
    const options = { quality: 0.1, base64: true };
    const data = await this.camera.takePictureAsync(options);
    this.resize(data.uri);
    this.setState({ showCamera: !this.state.showCamera});
    // }
  };

  resize = async(picture) => {
    ImageResizer.createResizedImage(picture, 500, 400, 'JPEG', 100, 0, RNFS.DocumentDirectoryPath)
    .then(({uri}) => {
      this.setState({profileImageAvatar:uri})
      this.convertToBAse64(uri)
    })
    .catch(err => {
        console.log(err);
        return Alert.alert(
            'Unable to resize the photo',
            // 'Check the console for full the error message',
        );
    });
  }

  convertToBAse64 = async(uri) => {
    const base64 = await RNFS.readFile(uri, 'base64');
    this.setState({
      profileImageBase64: base64,
      pictureIsChanged:true
    });
    // console.log(this.state.profileImageBase64);
	}
	
	renderData = (item) => {
		const {imageCard, roundImage, name} = styles;
		return(
			<ImageBackground source={{uri:item.item.media_url}} style={imageCard}>
				<View style={{flexDirection:'column', justifyContent:'space-between', height:200}}>
					<Image source={{uri:item.item.media_url}} style={roundImage} />
					{/* <Text style={name}>{item.item.text}</Text> */}
				</View>
			</ImageBackground>
		);
	}

	selectPicture = () => {
		console.log('this.selectPicture')
    this.setState({modalVisible: true});
	}
	
	render() {
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
			<>
			<SafeAreaView style={{padding:10}}>
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
				<FlatList
					numColumns={3}
					data={data}
					renderItem={this.renderData}
          keyExtractor={(item, index) => index.toString()}
				/>
			</SafeAreaView>
			<ActionButton
				buttonColor="rgba(231,76,60,1)"
				onPress={this.selectPicture}
			/>
			</>
		)
	}
}

const styles = ScaledSheet.create({
	imageCard: {
		height: 200,
		flexDirection:'row' ,
		flex:1,
		margin: 10,
		borderRadius:10,
		borderColor:'#cccccc',
		borderWidth:1,
		elevation:5
	},
	roundImage: {
		height:50,
		width:50,
		borderRadius:100,
		borderColor:'#0000cc',
		borderWidth:3,
		marginTop:5,
		marginLeft:5
	},
	name: {
		color:'#fff',
		fontWeight:'bold',
		marginBottom:5
	},
	buttonView: {
    marginTop: 50,
    height: 50,
    width: "85%",
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: color.orange,
    alignItems: "center",
    justifyContent: "center"
  },
  preview: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    height:'100%',
    // zIndex:999
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  }
});