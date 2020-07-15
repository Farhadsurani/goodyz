import React, { Component } from 'react';
import { View, ScrollView, Text, Dimensions } from "react-native";

import { color } from '../../constants/theme';

import {ScaledSheet} from 'react-native-size-matters';

import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';

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
export default class TotalVouchersRedeemedCmp extends Component {
  static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: (
				<View style={{width:'100%', justifyContent:'center', alignItems:'center', backgroundColor:color.primary, flexDirection:'row'}}>
					<Text style={{fontSize: 20, color:color.dark}}>Total Redeemed</Text>
        </View>
			),
			headerTitleStyle: { flex: 1, textAlign: "center" },
			headerStyle: {
				backgroundColor: color.primary
      }
		}
  };

  trimText(string) {
    if(string.length > 75)
      return string.substring(0, 75)+'...';
    else
      return string;
  }

  renderData = (item, index) => {
    const {mainContainerList, headingList} = styles;
    return(
      <TouchableOpacity activeOpacity={0.5} onPress={()=>this.gotoSingle(item.item)}>
        <View style={mainContainerList}>
          <Text style={headingList}>{this.trimText(item.item.discount)}</Text>
          <View style={{flexDirection:'column', alignItems:'flex-end'}}>
            <Text style={{color:color.green, fontSize:26, fontWeight:'bold'}}>{item.item.redeemed}</Text>
            <Text style={{color:color.darkGrey, fontSize:12}}>REDEEMED</Text>
          </View>
          <View>
            <FontAwesomeIcon icon={faChevronRight} size={20} color={color.darkGrey} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  gotoSingle(params){
    const tmp = data.find(e=> e.discount === params.discount);
    this.props.navigation.navigate('SingleVoucherReportCmp', {data:tmp});
  }

  render(){
    const {mainContainer, mainCard, mainCardText, heading} = styles;
    return(
      <View style={mainContainer}>
        <ScrollView>
          <View style={mainCard}>
            <Text style={[mainCardText, {fontSize:24}]}>145</Text>
            <Text style={[mainCardText, {fontSize:16}]}>Total Voucher Redeemed</Text>
          </View>
          
          <Text style={heading}></Text>
          
          <FlatList
            pagingEnabled={false}            
            showsVerticalScrollIndicator={false}
            data={data}
            renderItem={this.renderData}
            keyExtractor={(item, index) => index.toString()}
          />
        </ScrollView>
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
  }
})