import React, {Component} from 'react';
import { View, Text, AsyncStorage, ScrollView, FlatList } from 'react-native';

import { ImageCard } from '../common';
import { color } from '../../constants/theme';

import { ScaledSheet } from 'react-native-size-matters';

import {data} from '../../constants/data'

export default class WalletCmp extends Component {

  static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: (
				<View style={{width:'100%', justifyContent:'center', alignItems:'center', backgroundColor:color.primary, flexDirection:'row'}}>
					<Text style={{fontSize: 20, color:color.dark}}>Wallet</Text>
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
      wallet:''
    }
  }

  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", async() => {
      const isUserLogedIn = await this.checkUserLoggedIn();
      if(!isUserLogedIn){
        this.props.navigation.pop();
        this.props.navigation.navigate('Signin');
      }
      else {
        const user = await AsyncStorage.getItem('userData');
        const wallet = JSON.parse(user).wallet;
        this.setState({wallet: wallet});
        console.log(wallet);
      }
    });
  }

  async componentDidUpdate(prevProps) {
    console.log('componentDidUpdate');
    if (prevProps.isFocused !== this.props.isFocused) {
      console.log('componentDidUpdate isFocused');
      // Use the `this.props.isFocused` boolean
      // Call any action 
    }
  }

  checkUserLoggedIn = async () => {
    try {
      const value = await AsyncStorage.getItem('isUserLogedIn')
      if(value == null || value == false)
        return false;
      else
        return true;
    } 
    catch(e) {
      console.log(e);
    }
  }

  gotoDetail(data){
    this.props.navigation.navigate('VoucherDetailCmp', {data:data})
  }

  renderData = (item, index) => {
    const {mainContainer} = styles;
    return(
      item.item.is_wallet == 1 ?
        <View style={mainContainer}>
          <ImageCard 
            logo={{uri:item.item.offer.sponser.logo_url}} 
            text={item.item.offer.title}  
            bigImage={{uri:item.item.offer.banner_image_url}}
            isRedeemed={data[0].isRedeemed}
            onPress={()=> this.gotoDetail(item.item.offer)}
            height={200}
          />
        </View>
      :
        null
    )
  }

  render(){
    return(
      <View style={{backgroundColor:color.ligth}}>
        <FlatList
          pagingEnabled={false}            
          showsVerticalScrollIndicator={false}
          data={this.state.wallet}
          renderItem={this.renderData}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }
}

const styles = ScaledSheet.create({
  mainContainer:{
    backgroundColor:color.ligth,
    marginBottom:0
  }
})