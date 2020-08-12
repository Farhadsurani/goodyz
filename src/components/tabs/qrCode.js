import React, {Component} from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Dimensions, ImageBackground, AsyncStorage } from 'react-native';

import axios from 'axios';

import { color, images } from '../../constants/theme';

import QRCodeScanner from 'react-native-qrcode-scanner';
import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from "react-native-dialog";
// import { RNCamera } from 'react-native-camera';

const { height:deviceHeigth, width:deviceWidth } = Dimensions.get('screen');

export default class QrCodeCmp extends Component {

  static navigationOptions = ({ navigation }) => {
		return {
			header:null
		}
  };
  
  constructor(props) {
    super(props);
    this.state = {
      showSpinner:false,
      showAlert:false,
    }
  }
  
  componentDidMount() {
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    setTimeout(()=> {
      this.onSuccess({data:16})
    }, 2000)
  }

  handleCancel() {
    this.setState({showAlert:false});
  }

  onSuccess = async e => {
    console.log(e.data)
    const userData = await AsyncStorage.getItem('userData');
    if(userData == null)
      return;

    setTimeout(()=> {
      this.scanner.reactivate()
    }, 30000);
    const access_token = await AsyncStorage.getItem('access_token');
    
    this.setState({showSpinner:true});
    axios.defaults.headers.common['Authorization'] = 'Bearer '+access_token;
    axios.get('https://kanztainer.com/goodyz/api/v1/events/'+e.data).then((res)=> {
      this.setState({showSpinner:false});
      // console.log(res.data);
      // console.log(res.data.data.offers);
      this.props.navigation.navigate('QrDetailCmp', {data: res.data});
    }).catch((error)=> {
      this.setState({showSpinner:false});
      console.log('error', error);
      this.setState({showAlert:true, errorMsg:'Something went wrong. '+error, errorTitle:'Error!!'});
    });
  };

  render(){
    const { mainContainer, qrContainer, horizontal, spinnerTextStyle } = styles;

    return(
      <View>
        <ImageBackground style={mainContainer} source={images.background} resizeMode={'cover'}>
          <Text style={{marginTop:100, fontSize:22, fontWeight:'bold'}}>Scan QR</Text>
          <QRCodeScanner
            onRead={this.onSuccess}
            // flashMode={RNCamera.Constants.FlashMode.torch}
            containerStyle={qrContainer}
            cameraStyle={qrContainer}
            showMarker={true}
            markerStyle={qrContainer}
            ref={(node) => { this.scanner = node }}
          />
        </ImageBackground>
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

const styles = StyleSheet.create({
  mainContainer:{
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    height: deviceHeigth
  },
  qrContainer: {
    height:200,
    width:200,
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