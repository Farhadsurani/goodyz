import React, { Component } from 'react';
import { View, ScrollView, Text, Dimensions } from "react-native";

import { color } from '../../constants/theme';

import {ScaledSheet} from 'react-native-size-matters';

import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('screen');

const data = [
  {
    date:'Friday Oct 7, 2020',
    redeemed:'20'
  },
  {
    date:'Thursday Oct 6, 2020',
    redeemed:'15'
  },
  {
    date:'Wednesday Oct 5, 2020',
    redeemed:'0'
  },
  {
    date:'Tuesday Oct 4, 2020',
    redeemed:'18'
  },
  {
    date:'Monday Oct 3, 2020',
    redeemed:'12'
  },
  {
    date:'Sunday Oct 2, 2020',
    redeemed:'25'
  },
  {
    date:'Saturday Oct 1, 2020',
    redeemed:'5'
  },
]
export default class SingleVoucherReportCmp extends Component {
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

  constructor(props){
    super(props);
    this.state = {
      data:this.props.navigation.getParam('data')
    }
  }

  trimText(string) {
    if(string.length > 75)
      return string.substring(0, 75)+'...';
    else
      return string;
  }

  renderData = (item, index) => {
    const {mainContainerList, headingList} = styles;
    return(
      <View style={mainContainerList}>
        <Text style={headingList}>{this.trimText(item.item.date)}</Text>
        <View style={{flexDirection:'column', alignItems:'flex-end'}}>
          <Text style={{color:color.green, fontSize:26, fontWeight:'bold'}}>{item.item.redeemed}</Text>
          <Text style={{color:color.darkGrey, fontSize:12}}>REDEEMED</Text>
        </View>
      </View>
    )
  }

  render(){
    const {mainContainer, mainCard, mainCardText, heading} = styles;
    return(
      <View style={mainContainer}>
        <ScrollView>
          <View style={{width:deviceWidth-50, marginTop:10}}>
            <Text style={{fontSize:18, color:color.darkGrey}}>{this.state.data.title}</Text>
          </View>
          
          <View style={mainCard}>
            <Text style={[mainCardText, {fontSize:24}]}>{this.state.data.redeemed_count}</Text>
            <Text style={[mainCardText, {fontSize:16}]}>Total Voucher Redeemed</Text>
          </View>
          
          <Text style={heading}></Text>
          
          <View style={{borderTopWidth:1, borderTopColor:color.ligthGrey,}}>
            <FlatList
              pagingEnabled={false}
              showsVerticalScrollIndicator={false}
              data={data}
              renderItem={this.renderData}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
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
    // borderTopWidth:1,
    // borderTopColor:color.ligthGrey,
    borderBottomWidth:1,
    borderBottomColor:color.ligthGrey,
    borderRadius:10,
    width:deviceWidth-50,
    marginBottom:20,
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