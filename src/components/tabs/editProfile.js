import React, {Component} from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';

import { color, images } from '../../constants/theme';
import { FloatingInput } from '../common'

import {ScaledSheet, ms} from 'react-native-size-matters';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

const { height:deviceHeigth, width:deviceWidth } = Dimensions.get('screen');

export default class EditProfileCmp extends Component {

  static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: (
				<View style={{width:'100%', justifyContent:'center', alignItems:'center', backgroundColor:color.primary, flexDirection:'row'}}>
					<Text style={{fontSize: 20, color:color.dark}}>Profile</Text>
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
		// };
		// title: 'Dashboard',
		// headerTintColor: theme.color.ligth,
		// headerStyle: {
		//   backgroundColor: theme.color.primary, flex: 1, textAlign: "center"
		}
  };
  
  constructor(props) {
    super(props);
    this.props.navigation.setParams({
      popScreen: this.popScreen,
    });

    this.state = {
      name:'Mitchell Williamson',
      email:'pamela.foster@example.com',
      phone:'(843) 555-0130'
    }
  }

  popScreen = () => {
    this.props.navigation.pop();
  };

  render(){
    const { mainContainer, profilePicture, } = styles;

    return(
      <ScrollView>
        <View style={mainContainer}>
          <View>
            <Image style={profilePicture} source={images.profilePicture} />
            <TouchableOpacity activeOpacity={0.8} style={{position:'absolute', bottom:0, right:0, backgroundColor:color.ligth, height:30, width:30, alignItems:'center', justifyContent:'center', borderRadius:50, elevation:5}}>
              <FontAwesomeIcon icon={faCamera} size={20} color={color.dark} />
            </TouchableOpacity>
          </View>
        
          <View style={{marginTop:30, width:'90%'}}>
            <FloatingInput
              margin={ms(10)}
              width={'95%'} 
              label={'Name'} 
              value={this.state.name}
              ref={ref => this.erName = ref}
              onChangeText={text => {
                this.setState({ name: text });
              }}
            />
            <FloatingInput
              margin={ms(10)}
              width={'95%'} 
              label={'Email'} 
              value={this.state.email}
              ref={ref => this.erEmail = ref}
              keyboardType={'email-address'}
              onChangeText={text => {
                this.setState({ email: text });
              }}
            />
            <FloatingInput
              margin={ms(10)}
              width={'95%'} 
              label={'Phone'} 
              value={this.state.phone}
              ref={ref => this.erPhone = ref}
              keyboardType={'phone-pad'}
              onChangeText={text => {
                  this.setState({ phone: text });
              }}
            />
          </View>
        </View>
      </ScrollView>
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
  },
  profilePicture:{
    height:100,
    width:100,
    marginTop:30,
    borderRadius:50
  }
})