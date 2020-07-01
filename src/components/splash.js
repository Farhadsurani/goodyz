import React from "react";
import { View, Text, Animated, Easing, Image } from "react-native";

class Splash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text:false,
      inputStart:'-30deg',
      inputEnd:'20deg',
      loggedIn: null,
      rotateValue: new Animated.Value(0),
      isEnable: false,
      timeout:null,
      showBtn: false,
    };
    this.rotateAnimation();
    setTimeout(()=> {
      console.log('Settimeout')
      this.props.navigation.navigate('Auth')
    }, 3000)
  }
    
  async componentDidMount() {
    const data = await this.performTimeConsumingTask();
  }

  performTimeConsumingTask = async () => {
    // return new Promise(resolve =>
    setTimeout(() => {
      this.props.navigation.navigate('Auth')
      // resolve("result");
    }, 3000)
    // );
  };

  rotateAnimation = () => {
    Animated.sequence([
      Animated.timing(this.state.rotateValue, {
        toValue: 100,
        duration: 1000,
        easing: Easing.linear,
      }),
      Animated.timing(this.state.rotateValue, {
        toValue: 0,
        duration: 0,
      })
    ]).start(() => {
      this.setState({
        text:true,
        inputStart:'20deg',
        inputEnd:'20deg'
      })
    })
  }

  render() {
    const interpolatedRotation = this.state.rotateValue.interpolate({
      inputRange: [0, 100],
      outputRange: [this.state.inputStart, this.state.inputEnd]
    });
    return(
      <View style={styles.viewStyles}>
        {/* <Animated.Image
          source={require('./assets/Images/splash.jpg')}
          // resizeMode="contain"
          resizeMode="cover"
          style={[styles.imageView,
              { transform: [{ rotate: interpolatedRotation }] }
          ]}
        >  
        </Animated.Image>  */}
        {/* {
        this.state.text ?  */}
            <Image source={require('../assets/images/logo.png')}   
                style={[
                  { width: 150, height: 150, marginTop:'30%'},
                  // { transform: [{ rotate: interpolatedRotation }]}
                ]}
                resizeMode="contain"
            />
        {/* : 
        null
        }
        {
        this.state.text ?  */}
            <Text style={styles.heading}>Goodzy</Text>
        {/* : 
        null
        } */}
    </View>
    )
  }
}

const styles = {
    viewStyles: {
      flexDirection:'column',
      alignItems: "center",
      justifyContent: "center",
    },
    imageView: {
      height:850,
      width:650
    },
    heading: {
        fontSize: 35, 
        fontWeight:'bold' ,
        color:'#000', 
        backgroundColor:'#fff', 
        width:'100%', 
        textAlign:'center',
        marginTop:20
    }
};
  
export default Splash;