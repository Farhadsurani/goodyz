import React, {Component} from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image, FlatList, ScrollView } from 'react-native';

import { color } from '../../constants/theme';
import { data } from '../../constants/data';

import { ScaledSheet } from 'react-native-size-matters';

const { width:deviceWidth, height:deviceHeight } = Dimensions.get('screen');

export default class GoodyzListCmp extends Component {

  static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: (
				<View style={{width:'100%', justifyContent:'center', alignItems:'center', backgroundColor:color.primary, flexDirection:'row', marginRight:20}}>
					<Text style={{fontSize: 20, color:color.dark}}>Goodyz List</Text>
				</View>
			),
			headerTitleStyle: { flex: 1, textAlign: "center" },
			headerStyle: {
				backgroundColor: color.primary
      },
      // headerLeft:(
      //   <TouchableOpacity activeOpacity={0.5} style={{marginLeft:10}} onPress={()=> navigation.pop()}>
      //     <FontAwesomeIcon icon={faChevronLeft} size={20} color={color.dark} />
      //   </TouchableOpacity>
      // )
		}
  };

  constructor(props) {
    super(props)
  }

  trimText(string) {
    return string.substring(0, 110)+'...';
  }

  voucherDetail = () => {
    this.props.navigation.navigate('VoucherDetailCmp', {type:'addWallet'})
  }

  renderData = (item, index) => {
    const { mainContainer, logo, heading, description, expiry } = styles;
    return(
      <TouchableOpacity activeOpacity={0.5} onPress={this.voucherDetail}>
        <View style={mainContainer}>
          <Image style={logo} source={item.item.logo} />
          <View style={{flexDirection:'column', width:'80%', marginLeft:10}}>
            <Text style={heading}>{item.item.text}</Text>
            <View style={{flexDirection:'row'}}>
              <Text style={{fontSize:16,}}>Exp</Text>
              <Text style={expiry}>{item.item.expire}</Text>
            </View>
            <Text style={description}>
              {this.trimText(item.item.description)}
              {item.item.description.length >= 110?
                <Text style={{color:'#0A7AE1'}}>see more</Text>:null
              }
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return(
      <ScrollView style={{ paddingTop:20, backgroundColor:color.ligth, height:deviceHeight }}>
        <FlatList
          pagingEnabled={false}            
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={this.renderData}
          keyExtractor={(item, index) => index.toString()}
        />
      </ScrollView>
    )
  }
}

const styles = ScaledSheet.create({
  mainContainer:{
    flexDirection:'row',
    width:deviceWidth,
    marginBottom:20,
    marginLeft:10,
    marginRight:10,
    paddingBottom:10,
    borderBottomColor:color.ligthGrey,
    borderBottomWidth:2
  },
  logo:{
    height:40,
    width:40,
    borderRadius:50
  },
  heading:{
    fontSize:18,
    fontWeight:'900'
  },
  description:{
    marginTop:20,
    fontSize:16,
  },
  expiry:{
    fontSize:16,
    marginLeft:5,
    color:color.darkGrey
  }
})