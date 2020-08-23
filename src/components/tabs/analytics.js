import React, { Component } from 'react';
import { View, ScrollView, Text, Dimensions, AsyncStorage } from "react-native";

import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';

import { color } from '../../constants/theme';

import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from "react-native-dialog";
import axios from 'axios';

import {ScaledSheet} from 'react-native-size-matters';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('screen');

const data = [
  {
    discount:'50% off',
    redeemed:'95'
  },
  {
    discount:'Buy 1 Get 2 Free',
    redeemed:'25'
  },
  {
    discount:'60% off for new Lorem impsun is a dummy 60% off for new Lorem impsun is a dummy 60% off for new Lorem impsun is a dummy',
    redeemed:'25'
  },
]
export default class AnalyticsCmp extends Component {
  static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: (
				<View style={{width:'100%', justifyContent:'center', alignItems:'center', backgroundColor:color.primary, flexDirection:'row'}}>
					<Text style={{fontSize: 20, color:color.dark}}>Analytics</Text>
        </View>
			),
			headerTitleStyle: { flex: 1, textAlign: "center" },
			headerStyle: {
				backgroundColor: color.primary
      }
		}
  };

  constructor(props) {
    super(props);
    this.state= {
      data:'',
      showSpinner:false,
      showAlert:false,
      errorMsg:'',
      errorTitle:'',
    }
  }

  async componentDidMount() {
    this.setState({showSpinner:true});
    const date = new Date();
    const today = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate();
    console.log(today);

    const access_token = await AsyncStorage.getItem('access_token');
    const headers = {
      headers: {
        'Authorization': 'Bearer '.concat(access_token)
      }
    }

    axios.get('https://kanztainer.com/goodyz/api/v1/sponser/offers-stats?date='+today, headers).then(
      async (res)=> {
        this.setState({showSpinner:false});
        console.log(res.data.data);
        this.setState({data: res.data.data});
      }).catch(
        (error)=> {
          this.setState({showSpinner:false});
          console.log('error', error);
          this.setState({showAlert:true, errorMsg: error+' Try logout and login again.', errorTitle:'Error!!'});
        }
      );
  }

  trimText(string) {
    if(string.length > 75)
      return string.substring(0, 50)+'...';
    else
      return string;
  }

  renderData = (item, index) => {
    const {mainContainerList, headingList} = styles;
   return(
      <TouchableOpacity activeOpacity={0.5} onPress={()=>this.gotoSingle(item.item)}>
        <View style={mainContainerList}>
          <Text style={headingList}>{this.trimText(item.item.title)}</Text>
          <View style={{flexDirection:'column', alignItems:'flex-end'}}>
            <Text style={{color:color.green, fontSize:26, fontWeight:'bold'}}>{item.item.redeemed_count}</Text>
            <Text style={{color:color.darkGrey, fontSize:12}}>REDEEMED</Text>
          </View>
          <View>
            <FontAwesomeIcon icon={faChevronRight} size={20} color={color.darkGrey} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  gotoTotal = () => {
    this.props.navigation.navigate('TotalVouchersRedeemedCmp')
  }

  gotoSingle(params){
    const tmp = this.state.data.offers.find(e=> e.id === params.id);
    this.props.navigation.navigate('SingleVoucherReportCmp', {data:tmp});
  }

  handleCancel() {
    this.setState({showAlert:false});
  }
  
  render(){
    const {mainContainer, mainCard, mainCardText, heading, spinnerTextStyle, horizontal} = styles;
    return(
      <View style={mainContainer}>
        <ScrollView>
          <TouchableOpacity activeOpacity={0.5} onPress={this.gotoTotal}>
            <View style={mainCard}>
              <Text style={[mainCardText, {fontSize:24}]}>{this.state.data.total_redeemed_count}</Text>
              <Text style={[mainCardText, {fontSize:16}]}>Total Voucher Redeemed</Text>
            </View>
          </TouchableOpacity>

          <Text style={heading}>Today</Text>
          
          <FlatList
            pagingEnabled={false}            
            showsVerticalScrollIndicator={false}
            data={this.state.data.offers}
            renderItem={this.renderData}
            keyExtractor={(item, index) => index.toString()}
          />
        </ScrollView>
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
    );
  }
}

const styles = ScaledSheet.create({
  mainContainer: {
    backgroundColor:color.ligth,
    flexDirection:'column',
    alignItems:'center',
    height:deviceHeight
  },
  mainCard: {
    width:deviceWidth-50,
    backgroundColor:color.ligthBlue,
    alignItems:'center',
    padding:10,
    marginTop:10,
    borderRadius:10,
  },
  mainCardText: {
    color:color.darkBlue,
  },
  heading:{
    fontSize:18,
    marginTop:10,
    marginBottom:10
  },
  mainContainerList: {
    padding:10,
    borderWidth:1,
    borderColor:color.ligthGrey,
    borderRadius:10,
    width:deviceWidth-50,
    marginBottom:10,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    // height:50
  },
  headingList:{
    width:'65%', 
    textAlignVertical:'center',
    fontSize:16
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