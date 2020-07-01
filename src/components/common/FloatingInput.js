// Import a libraries to help making a component
import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';

import { color } from '../../constants/theme';

// import DatePicker from 'react-native-datepicker';

// Make a component
const FloatingInput = ({ label, value, onChangeText, secureTextEntry, keyboardType='default', width= moderateScale(200), isDate=false, margin=0, maxLengthProp=0, placeholder }) => {
    const { inputField, inputFieldDate, labelStyle, container } = styles;
    const date = new Date();
    const currentDate = date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear();
    return (
        <View style={[container, {width:width, margin:margin}]}>
            <Text style={labelStyle}>{label}</Text>
            {/* {isDate ?
                <DatePicker
                    style={inputFieldDate}
                    date={value}
                    mode="date"
                    placeholder=""
                    format="DD-MM-YYYY"
                    minDate="01-05-1980"
                    maxDate={currentDate}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    ref={o => {this.inputRef = o}}
                    customStyles={{
                        dateIcon: {
                            width:0
                        },
                        dateInput: {
                            marginLeft: 0,
                            borderWidth:0
                        },
                        dateText: {
                            width: '100%',
                            height: moderateScale(30),
                            color: '#2e2c2e',
                            fontSize: moderateScale(14),
                            fontFamily: "AvertaStd-Regular",
                            fontWeight:'normal',
                            paddingTop:moderateScale(9)
                        }
                        // ... You can check the source to find the other keys.
                    }}
                    onDateChange={(date) => {onChangeText(date)}}
                />
                : */}
                <TextInput 
                    secureTextEntry={secureTextEntry}
                    clearTextOnFocus={secureTextEntry}
                    style={inputField} 
                    value={value}
                    onChangeText={text => {onChangeText(text)}}
                    autoCorrect={false}
                    ref={o => {this.inputRef = o}}
                    keyboardType={keyboardType}
                    maxLength={maxLengthProp != 0 ? 11:null}
                    placeholder={placeholder}
                />
            {/* } */}
        </View>
    );
}

const styles = ScaledSheet.create({
    inputField: {
        width: '100%',
        height: '40@ms',
        color: '#2e2c2e',
        paddingRight: '5@ms',
        paddingLeft: '10@ms',
        paddingBottom: '3@ms',
        fontSize: '14@ms',
        borderRadius:'5@ms',
        backgroundColor: '#fff',
        borderColor:color.ligthGrey,
        borderWidth:1,
        // borderLeftWidth: 5,
        // borderLeftColor:'#7e4692',
        // fontFamily: "AvertaStd-Regular",
        fontWeight:'normal',
        
    },
    inputFieldDate: {
        width: '100%',
        height: '40@ms',
        color: '#2e2c2e',
        paddingRight: '5@ms',
        paddingLeft: '10@ms',
        paddingBottom: '3@ms',
        fontSize: '14@ms',
        borderRadius:'5@ms',
        backgroundColor: '#fff',
        borderColor:'#000',
        borderWidth:1,
        // borderLeftWidth: 5,
        // borderLeftColor:'#7e4692',
        // fontFamily: "AvertaStd-Regular",
        fontWeight:'normal',
    },
    labelStyle: {
        fontSize: '12@ms',
        marginBottom: 5,
        color: color.darkGrey,
        // fontFamily: "AvertaStd-Bold",
    },
    container: {
        height: '50@ms',
        marginTop:'10@ms',
        flexDirection: 'column',
        // marginLeft:'20@ms',
    }
});

// Make the component available to other parts of the app
export { FloatingInput };