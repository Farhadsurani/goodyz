import React, {Component} from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';

import { color, images } from '../../constants/theme';
import { FloatingInput } from '../common'

import {ScaledSheet, ms} from 'react-native-size-matters';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

const { height:deviceHeigth, width:deviceWidth } = Dimensions.get('screen');

export default class ChangePasswordCmp extends Component {

  static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: (
				<View style={{width:'100%', justifyContent:'center', alignItems:'center', backgroundColor:color.primary, flexDirection:'row'}}>
					<Text style={{fontSize: 20, color:color.dark}}>Change Password</Text>
        </View>
			),
			headerTitleStyle: { flex: 1, textAlign: "center" },
			headerStyle: {
				backgroundColor: color.primary
      },
      headerRight:(
        <TouchableOpacity style={{marginRight:10}} activeOpacity={0.5} onPress={()=> navigation.getParam('popScreen')()}>
          <Text style={{color:color.blue}}>Done</Text>
        </TouchableOpacity>
      ),
      headerLeft:(<></>)
		}
  };
  
  constructor(props) {
    super(props);
    this.props.navigation.setParams({
      popScreen: this.popScreen,
    });

    this.state = {
      oldpassword:'',
      newPassword:''
    }
  }

  popScreen = () => {
    this.props.navigation.pop();
  };

  render(){
    const { mainContainer} = styles;

    return(
      <View style={mainContainer}>
        <View style={{marginTop:30, width:'90%'}}>
          <FloatingInput
            margin={ms(10)}
            width={'95%'} 
            label={'Old Password'} 
            value={this.state.oldPassword}
            ref={ref => this.erOldPassword = ref}
            onChangeText={text => {
              this.setState({ oldpassword: text });
            }}
          />
          <FloatingInput
            margin={ms(10)}
            width={'95%'} 
            label={'New Password'} 
            value={this.state.newPassword}
            ref={ref => this.erNewPassword = ref}
            onChangeText={text => {
              this.setState({ newPassword: text });
            }}
          />
        </View>
      </View>
    )
  }
}

const styles = ScaledSheet.create({
  mainContainer:{
    flexDirection:'column',
    justifyContent:'flex-start',
    alignItems:'center',
    height: deviceHeigth,
    padding:10,
    backgroundColor:color.ligth
  }
})