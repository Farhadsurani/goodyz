import React, {Component} from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Dimensions, ImageBackground } from 'react-native';

import { color, images } from '../../constants/theme';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

const { height:deviceHeigth, width:deviceWidth } = Dimensions.get('screen');

export default class QrCodeCmp extends Component {

  static navigationOptions = ({ navigation }) => {
		return {
			header:null
		}
  };
  
  onSuccess = e => {
    console.log(e.data)
  };

  render(){
    const { mainContainer, qrContainer } = styles;

    return(
      <ImageBackground style={mainContainer} source={images.background} resizeMode={'cover'}>
        <Text style={{marginTop:100, fontSize:22, fontWeight:'bold'}}>Scan QR</Text>
        <QRCodeScanner
          onRead={this.onSuccess}
          // flashMode={RNCamera.Constants.FlashMode.torch}
          containerStyle={qrContainer}
          cameraStyle={qrContainer}
          showMarker={true}
          markerStyle={qrContainer}
        />
      </ImageBackground>
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
  }
});