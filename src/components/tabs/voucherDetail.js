import React, {Component} from 'react';
import { View, Text, TouchableOpacity, Dimensions, AsyncStorage } from 'react-native';

import { ImageCard, Button } from '../common';
import { color } from '../../constants/theme';
import { data } from '../../constants/data';

import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from "react-native-dialog";
import axios from 'axios';
import { ScaledSheet } from 'react-native-size-matters';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft,  faCheckCircle } from '@fortawesome/free-solid-svg-icons';
 
export default class VoucherDetailCmp extends Component {

  static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: (
				<View style={{width:'100%', justifyContent:'center', alignItems:'center', backgroundColor:color.primary, flexDirection:'row', marginRight:20}}>
					<Text style={{fontSize: 20, color:color.dark}}>Summer Sale</Text>
				</View>
			),
			headerTitleStyle: { flex: 1, textAlign: "center" },
			headerStyle: {
				backgroundColor: color.primary
      },
      headerLeft:(
        <TouchableOpacity activeOpacity={0.5} style={{marginLeft:10}} onPress={()=> navigation.pop()}>
          <FontAwesomeIcon icon={faChevronLeft} size={20} color={color.dark} />
        </TouchableOpacity>
      )
		}
  };

  constructor(props){
    super(props);
    this.state = {
      isRedeemed:false,
      type:this.props.navigation.getParam('type', null),
      isAddWalletMsg:false,
      isAddWalletBtn:false,
      data:this.props.navigation.getParam('data'),
      showSpinner:false,
      showAlert:false,
    }
  }

  componentDidMount(){
    // console.log('``````Data```````')
    // console.log(this.state.data)
  }

  gotoDetail = () => {
    console.log('gotoDetails')
  }

  redeem = async() => {
    if(!this.state.isRedeemed){
      this.setState({showSpinner:true});
      const user_access_token = await AsyncStorage.getItem('access_token');
      let access_token = {
        headers: {
          'Authorization': 'Bearer '.concat(user_access_token)
        }
      };
      console.log(access_token, this.state.data.id);
      axios.get('https://kanztainer.com/goodyz/api/v1/offer-add-impression?offer_id='+this.state.data.id+'&is_redeemed=1', access_token).then(
        async(res)=> {
          console.log(res.data);
          this.setState({isRedeemed:!this.state.isRedeemed, showSpinner:false})
          this.refreshUser(access_token);
        }
      ).catch(
        async(error)=> {
          this.setState({showSpinner: false});
          console.log('error', error);
          this.setState({showAlert:true, errorMsg:'Something went wrong.'+error, errorTitle:'Error!!'})
        }
      );
    }
    else {
      console.log('else')
    }
  }

  handleCancel() {
    this.setState({showAlert:false});
  }

  addToWallet= async () => {
    if(!this.state.isAddWalletBtn){
      this.setState({showSpinner:true});
      const user_access_token = await AsyncStorage.getItem('access_token');
      let access_token = {
        headers: {
          'Authorization': 'Bearer '.concat(user_access_token)
        }
      };
      console.log(access_token, this.state.data.id);
      axios.get('https://kanztainer.com/goodyz/api/v1/offer-add-impression?offer_id='+this.state.data.id+'&is_wallet=1', access_token).then(
        async(res)=> {
          console.log(res.data);
          this.setState({showSpinner:false, isAddWalletMsg:true, isAddWalletBtn:true});
          this.refreshUser(access_token);
          setTimeout(()=> {
            this.setState({isAddWalletMsg:false})
          }, 5000)
        }
      ).catch(
        async(error)=> {
          this.setState({showSpinner: false});
          console.log('error', error);
          this.setState({showAlert:true, errorMsg:'Something went wrong.'+error, errorTitle:'Error!!'})
        }
      );
    }
    else {
      console.log('else')
      this.props.navigation.navigate('WalletCmp')
    }
  }

  async refreshUser(header) {
    // console.log('refreshUser');
    // const access_token = await AsyncStorage.getItem('access_token');
    // const header = {
    //   headers: {
    //     'Authorization': 'Bearer '.concat(access_token)
    //   }
    // }
    const url = 'https://kanztainer.com/goodyz/api/v1/me'
    axios.post(url, header).then(async(res)=> {
      console.log(res.data.data);
      await AsyncStorage.setItem('userData', JSON.stringify(res.data.data));
    }).catch((error)=> {
      console.log('error', error);
    });
  }

  render(){
    const { mainContainer, btnContainer, horizontal, spinnerTextStyle } = styles;

    return(
      <View style={{flex:1}}>
        {
          this.state.isAddWalletMsg?
          <View style={{flexDirection:'row', padding:20, backgroundColor:'#27AE60', alignItems:'center', position:'absolute', zIndex:9, width:Dimensions.get('screen').width}}>
            <FontAwesomeIcon icon={faCheckCircle} size={18} color={color.ligth} />
            <Text style={{fontWeight:'bold', color:color.ligth, fontSize:16, marginLeft:10}}>The voucher has been added to the wallet.</Text>
          </View>
          :
          null
        } 
        <ScrollView style={{backgroundColor:color.ligth}}>
          <View style={mainContainer}>
            <ImageCard 
              logo={{uri:this.state.data.sponser.logo_url}} 
              text={this.state.data.title}  
              bigImage={{uri:this.state.data.banner_image_url}}
              isRedeemed={this.state.isRedeemed}
              qrCode={{uri:this.state.data.qrcode_url}}
              onPress={this.gotoDetail}
              isDetail={true}
              expire={this.state.data.expiration_date}
              description={this.state.data.description}
              height={200}
            />
          </View>
        </ScrollView>
        <View style={btnContainer}>
          {
            this.state.type == 'addWallet'?
            <Button 
              btnColor={color.yellow} 
              textColor={color.dark} 
              btnName={this.state.isAddWalletBtn?'GO TO WALLET':'ADD TO WALLET'} 
              borderRadius={50} 
              width={Dimensions.get('screen').width-50}
              onPress={this.addToWallet}
            />
            :
            <Button 
              btnColor={color.yellow} 
              textColor={color.dark} 
              btnName={this.state.isRedeemed?'REDEEMED':'REDEEM'} 
              borderRadius={50} 
              width={Dimensions.get('screen').width-50}
              onPress={this.redeem}
              isDisable={this.state.isRedeemed}
            />
          }
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
      </View>
    )
  }
}

const styles = ScaledSheet.create({
  mainContainer:{
    backgroundColor:color.ligth,
    marginBottom:20,
    justifyContent:'center',
    alignItems:'center'
  },
  btnContainer:{
    height:80,
    paddingTop:20,
    width:Dimensions.get('screen').width,
    alignItems:'center',
    backgroundColor:color.ligth,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
    borderTopColor:'#e5e5e5',
    borderTopWidth:2
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