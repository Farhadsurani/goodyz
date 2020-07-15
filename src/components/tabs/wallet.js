import React, {Component} from 'react';
import { View, Text, AsyncStorage } from 'react-native';

import { ImageCard, Button } from '../common';
import { color } from '../../constants/theme';
import { data } from '../../constants/data';

import { ScaledSheet } from 'react-native-size-matters';
import { ScrollView } from 'react-native-gesture-handler';
// import AsyncStorage from '@react-native-community/async-storage';

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
  }

  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", async() => {
      const isUserLogedIn = await this.checkUserLoggedIn();
      if(!isUserLogedIn){
        this.props.navigation.pop();
        this.props.navigation.navigate('Signin');
      }
      console.log(isUserLogedIn);
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
      console.log('wallet', value);
      if(value == null || value == false)
        return false;
      else
        return true;
    } 
    catch(e) {
      console.log(e);
    }
  }

  gotoDetail = () => {
    this.props.navigation.navigate('VoucherDetailCmp')
  }

  render(){
    const { mainContainer } = styles;

    return(
      <ScrollView style={{backgroundColor:color.ligth}}>
        <View style={mainContainer}>
          <ImageCard 
            logo={data[0].logo} 
            text={data[0].text}  
            bigImage={data[0].bigImage}
            isRedeemed={data[0].isRedeemed}
            onPress={this.gotoDetail}
          />
        </View>
      </ScrollView>
    )
  }
}

const styles = ScaledSheet.create({
  mainContainer:{
    backgroundColor:color.ligth,
    marginBottom:60
  }
})