import React, {Component} from 'react';
import { Text, StyleSheet, View, Dimensions, AsyncStorage } from 'react-native';
import { NavigationEvents, NavigationScreenProps } from 'react-navigation';

import axios from 'axios';

import { color, images } from '../../constants/theme';

import QRCodeScanner from 'react-native-qrcode-scanner';
import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from "react-native-dialog";
import { requestOneTimePayment, requestBillingAgreement } from 'react-native-paypal';

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
      isFocused:false
    }
  }
  
  async componentDidMount() {
    // axios.defaults.headers.post['Content-Type'] = 'application/json';
    // const userType = await AsyncStorage.getItem('userType');
    // if(userType == 'user')
    //   setTimeout(()=> {
    //     this.onSuccess({type:'offer', id:22})
    //   }, 2000)
  }

  handleCancel() {
    this.setState({showAlert:false});
  }

  onDidFocus = payload => {
    this.setState({ isFocused: true });
  };
  
  onDidBlur = payload => {
    this.setState({ isFocused: false });
  };

  onSuccess = async e => {
    // console.log('onSuccess', e.data);
    const parseQrData = JSON.parse(e.data);
    // console.log(parseQrData.type, parseQrData.id)
    // console.log('https://kanztainer.com/goodyz/api/v1/events/'+parseQrData.id);

    this.setState({showSpinner:true});
    axios.get('https://kanztainer.com/goodyz/api/v1/events/'+parseQrData.id).then((res)=> {
      this.setState({showSpinner:false});
      // setTimeout(()=> {
      //   this.scanner.reactivate();
      // }, 3000)
      // console.log(res.data);
      if(parseQrData.type == 'offer')
        this.props.navigation.navigate('QrDetailCmp', {data: res.data});
      // else
      //   this.props.navigation.navigate('AnalyticsCmp');

    }).catch((error)=> {
      this.setState({showSpinner:false});
      // console.log('error', error);
      this.setState({showAlert:true, errorMsg:'Something went wrong. '+error, errorTitle:'Error!!'});
      setTimeout(()=> {
        this.scanner.reactivate();
      }, 5000)
    });
  };

  render(){
    const { mainContainer, qrContainer, horizontal, spinnerTextStyle, marker } = styles;

    return(
      <View>
        {/* <ImageBackground style={mainContainer} source={images.background} resizeMode={'cover'}> */}
          <NavigationEvents
            onDidFocus={this.onDidFocus}
            onDidBlur={this.onDidBlur}
          />
          <Text style=
            {{
              top:50, 
              fontSize:22, 
              fontWeight:'bold', 
              position:'absolute', 
              zIndex:9, 
              width: deviceWidth, 
              textAlign:"center",
            }}
          >
            Scan QR
          </Text>
          {this.state.isFocused && (
          <QRCodeScanner
            onRead={this.onSuccess}
            // flashMode={RNCamera.Constants.FlashMode.torch}
            containerStyle={qrContainer}
            cameraStyle={qrContainer}
            showMarker={true}
            markerStyle={marker}
            ref={(node) => { this.scanner = node }}
          />
          )}
        {/* </ImageBackground> */}
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
    height: deviceHeigth,
    width: deviceWidth,
  },
  marker: {
    height: 300,
    width: 300,
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