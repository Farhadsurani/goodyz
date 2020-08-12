import React, {Component} from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView, Image } from 'react-native';

import { ImageCard, Button } from '../common';
import { color } from '../../constants/theme';
import { data } from '../../constants/data';

import { ScaledSheet } from 'react-native-size-matters';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const {height: deviceHeight, width: deviceWidth} = Dimensions.get('screen');

export default class QrDetailCmp extends Component {

  static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: (
				<View style={{width:'100%', justifyContent:'center', alignItems:'center', backgroundColor:color.primary, flexDirection:'row', marginRight:20}}>
					<Text style={{fontSize: 20, color:color.dark}}>QR Details</Text>
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

  constructor(props){
    super(props);
    this.state = {
      isRedeemed:false,
      data: this.props.navigation.getParam('data').data,
      width:'',
      height:''
    }
  }

  gotoDetail = () => {
    console.log('gotoDetails')
  }

  detail = () => {
    this.props.navigation.navigate('GoodyzListCmp', {data: this.state.data.offers});
  }

  render(){
    const { mainContainer, btnContainer } = styles;

    return(
      <View style={{flex:1}}>
        <ScrollView style={{backgroundColor:color.ligth}}>
          <View style={mainContainer}>
            <ImageCard 
              logo={{uri:this.state.data.logo_url}} 
              text={this.state.data.name}
              bigImage={{uri:this.state.data.banner_image_url}}
              isRedeemed={data[1].isRedeemed}
              // onPress={this.gotoDetail}
              isDetail={true}
              expire={data[1].expire}
              description={this.state.data.description}
              height={200}
              // isRedeemed={this.state.isRedeemed}
            />
          </View>
        </ScrollView>
        <View style={btnContainer}>
          <Button 
            btnColor={color.yellow} 
            textColor={color.dark} 
            btnName={'VIEW GOODYZ'} 
            borderRadius={50} 
            width={Dimensions.get('screen').width-50}
            onPress={this.detail}
            isDisable={this.state.isRedeemed}
          />
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
  }
})