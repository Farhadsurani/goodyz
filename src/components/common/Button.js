// Import a libraries to help making a component
import React ,{Component} from 'react';
import { Text, TouchableOpacity, Image } from 'react-native';
import { ScaledSheet, ms } from 'react-native-size-matters';

// Make a component
class Button extends Component {
  constructor(props) {
    super(props);
  }

  //btnColor='#986aa7'
  render(){
    const { onPress, btnName, isDisable=false, width=ms(250) } = this.props;
    const { buttonStyle, text } = styles;
    return (
      <TouchableOpacity style={[buttonStyle, {backgroundColor:this.props.btnColor, width:width}]} onPress={onPress} activeOpacity={0.5}  disabled={isDisable}>
        <Text style={text}>
          {btnName}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = ScaledSheet.create({
  text: {
    fontSize: '12@ms',
    fontWeight: 'normal',
    textAlign: 'center',
    color: '#ffffff',
  },
  buttonStyle: {
    marginTop:'20@ms',
    borderRadius:'5@ms',
    height:'40@ms',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  }
});

// Make the component available to other parts of the app
export { Button };
