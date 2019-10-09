import React, { Component } from 'react';
import { View, ToastAndroid,BackHandler,Dimensions  ,  BackAndroid,} from 'react-native';
import { Button,FormLabel,FormInput,Text } from 'react-native-elements';
import axios from 'axios';
import { tabScreen,baseUrl } from '../helper/stuff';
import Snackbar from 'react-native-snackbar';
import {IconsMap, IconsLoaded} from '../helper/appIcon';

var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
let heightScreen = Dimensions.get('window').height; //full height

class Screen extends Component {

  constructor(props){
    super(props);
    this.state = {
      _token:'',
      nik:'',
      password:''
    };

  }

  componentDidMount(){
    axios.get(baseUrl+'getTokenS')
    .then( (r) => {
      this.setState({ _token: r.data });
    })
    .catch(function (error) {
    //  ToastAndroid.show('network eror', ToastAndroid.SHORT);
    });
    MessageBarManager.registerMessageBar(this.refs.alert);
  }
  componentWillUnmount() {
  // Remove the alert located on this master page from the manager
    MessageBarManager.unregisterMessageBar();
  }

  loginProses = () => {
  //   tabScreen(this.state.nik);
    //
    BackAndroid.exitApp();



    if(this.state.nik == ""){
      MessageBarManager.showAlert({
          title: '',
          message: 'NIC number is empty',
          alertType: 'error',
    // See Properties section for full customization
    // Or check `index.ios.js` or `index.android.js` for a complete example
        });
        return;
    }
    if(this.state.nik.length != 10){
      MessageBarManager.showAlert({
          title: '',
          message: 'NIC length invalid',
          alertType: 'error',
    // See Properties section for full customization
    // Or check `index.ios.js` or `index.android.js` for a complete example
        });
        return;
    }


    if(!this.validation(this.state.nik)){
      MessageBarManager.showAlert({
          title: '',
          message: 'NIC format invalid',
          alertType: 'error',
    // See Properties section for full customization
    // Or check `index.ios.js` or `index.android.js` for a complete example
        });
        return;
    }


    if(this.state.password == ""){
      MessageBarManager.showAlert({
          title: '',
          message: 'Password is empty',
          alertType: 'error',
    // See Properties section for full customization
    // Or check `index.ios.js` or `index.android.js` for a complete example
        });
        return;
    }


  }

   validation(nicNumber) {
    var result = false;
    if (nicNumber.length === 10 && !isNaN(nicNumber.substr(0, 9)) && isNaN(nicNumber.substr(9, 1).toLowerCase()) && ['x', 'v'].includes(nicNumber.substr(9, 1).toLowerCase())) {
        result = true;
    } else if (nicNumber.length === 12 && !isNaN(nicNumber)) {
        result = true;
    } else {
        result = false;
    }
    return result;
}

  toSignUp = () => {
    this.props.navigator.showModal({
      screen: 'SignUp',
      title: 'Sign Up',
      passProps: {
        id: 'xx'
      },
      navigatorButtons: {
        rightButtons: [
            {
                icon: IconsMap['done'], // for icon button, provide the local image asset name
                buttonColor: '#2c3e50',
                id: 'save' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
            }
        ]
      }
    });
  }

  render() {
    return (
      <View
        style={{
            backgroundColor: '#ecf0f1',
            height:heightScreen
          }} >
          <View
            style={{
              justifyContent:'center',
              flexDirection:'row',
              marginTop:30
            }} >

            <Text h3>Thank you</Text>
           </View>
          <MessageBarAlert ref="alert" />

          <FormLabel>Please proceed to village headman for manual verification</FormLabel>

          <Button
            raised
            containerViewStyle={{marginTop:10, borderRadius:22}}
            buttonStyle={{borderRadius:22, backgroundColor:'#35530A'}}
            title='OK'
            onPress={() => this.loginProses()} />

          <View
            style={{
              justifyContent:'center',
              flexDirection:'row',
              marginTop:5
            }} >

          </View>
      </View>
    );
  }
}

export default Screen;
