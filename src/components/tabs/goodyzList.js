import React, {Component} from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image, FlatList, ScrollView, AsyncStorage } from 'react-native';

import { color } from '../../constants/theme';

import axios from 'axios';
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
    super(props);
    this.state = {
      data: this.props.navigation.getParam('data')
    }
  }

  trimText(string) {
    return string.substring(0, 110)+'...';
  }

  voucherDetail = (data) => {
    this.addImpresion(data.id);
    this.props.navigation.navigate('VoucherDetailCmp', {type:'addWallet', data:data});
  }
  
  addImpresion(id) {
    console.log(id)
    axios.get('https://kanztainer.com/goodyz/api/v1/offer-add-impression?offer_id='+id+'&is_clicked=1').then((res)=> {
      console.log(res.data);
      this.refreshUser();
    }).catch((error)=> {
      console.log('error', error);
    });
  }
  
  async refreshUser() {
    console.log('refreshUser');
    const access_token = await AsyncStorage.getItem('access_token');
    const header = {
      headers: {
        'Authorization': 'Bearer '.concat(access_token)
      }
    }
    const url = 'https://kanztainer.com/goodyz/api/v1/me'
    axios.post(url, header).then(async(res)=> {
      console.log(res.data.data);
      await AsyncStorage.setItem('userData', JSON.stringify(res.data.data));
    }).catch((error)=> {
      console.log('error', error);
    });
  }

  renderData = (item, index) => {
    const { mainContainer, logo, heading, description, expiry } = styles;
    return(
      <TouchableOpacity activeOpacity={0.5} onPress={() => this.voucherDetail(item.item)}>
        <View style={mainContainer}>
          <Image style={logo} source={{uri:item.item.sponser.logo_url}} />
          <View style={{flexDirection:'column', width:'80%', marginLeft:10}}>
            <Text style={heading}>{item.item.title}</Text>
            <View style={{flexDirection:'row'}}>
              <Text style={{fontSize:16,}}>Exp</Text>
              <Text style={expiry}>{item.item.expiration_date}</Text>
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
          data={this.state.data}
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