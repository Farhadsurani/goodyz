// Import a libraries to help making a component
import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';

import { color, images } from '../../constants/theme';
import { TouchableOpacity } from 'react-native-gesture-handler';

const {height: deviceHeight, width: deviceWidth} = Dimensions.get('screen');

// Make a component
const ImageCard = ({logo, text, bigImage, isRedeemed = false, onPress, isDetail = false, expire, description}) => {
  const {mainContainer, imageContainer, image, shortTag, saleImage} = styles;

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View style={mainContainer}>
        <View style={imageContainer}>
          <View style={{borderRadius:50, borderColor:color.darkGrey, borderWidth:1, height:45, width:45, alignItems:'center', justifyContent:'center'}}>
            <Image resizeMode={'cover'} source={logo} style={image} />
          </View>
          <Text style={shortTag}>{text}</Text>
        </View>
        <Image resizeMode={'cover'} source={bigImage} style={saleImage} />
      
      {
        isDetail?
        <View style={{flexDirection:'column'}}>
          <View style={{flexDirection:'row', justifyContent:'space-between', marginVertical:20}}>
            <Text style={{fontSize:16, fontWeight:'bold', color:color.dark, marginLeft:15}}>Expiration Date</Text>
            <Text style={{fontSize:16, color:color.darkGrey, marginRight:15}}>{expire}</Text>
          </View>
          {
            isRedeemed?
            <View style={{width:Dimensions.get('screen').width, alignItems:'center'}}>
              <Image source={images.qrCode} resizeMode={'contain'} style={{height:200, width:200}}/>
            </View>
            : null
          }
          <Text style={{marginHorizontal:15, fontSize:16, fontWeight:'bold', marginBottom:10}}>Offer Description</Text>
          <Text style={{marginHorizontal:15, fontSize:16, }}>{description}</Text>
        </View>
        :
        null
      }
      </View>
      </TouchableOpacity>
  );
}

const styles = ScaledSheet.create({
  mainContainer:{
    flexDirection:'column',
    justifyContent:'center',
    width: deviceWidth,
    alignItems:'center',
    elevation:5,
    marginVertical:20,
  },
  imageContainer:{
    flexDirection:'row',
    width:deviceWidth,
    alignItems:'center',
    marginVertical:10,
    marginLeft:20,
  },
  image:{
    borderRadius:50,
    width:35,
    height:35
  },
  shortTag:{
    fontSize:18,
    fontWeight:'500',
    marginLeft:10
  },
  saleImage:{
    width:deviceWidth-30,
    borderRadius:10,
  }
});

// Make the component available to other parts of the app
export { ImageCard };