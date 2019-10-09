import React, { Component } from 'react';
import { View,Text, ToastAndroid,BackHandler,Dimensions,ScrollView,Picker,DatePickerAndroid } from 'react-native';
import { Button,FormLabel,FormInput,Icon } from 'react-native-elements';
import axios from 'axios';
import { baseUrl } from '../helper/stuff';

import { Navigation } from 'react-native-navigation';


let widthScreen = Dimensions.get('window').width; //full width
let heightScreen = Dimensions.get('window').height; //full height
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

class Screen extends Component {

  static navigatorStyle = {
    navBarBackgroundColor: '#1abc9c'
  };

  constructor(props){
    super(props);
    this.state = {
      _token:'',
      nik:'',
      username:'',
      password:'',
      nama:'',
      jenis_kelamin:1,
      tempat_lahir:'',
      alamat:'',
      agama:0,
      pekerjaan:'',
      tlp:'',
      email:'',
      tanggal_lahir:'',
      id_kota:1101,
      list_kota:[],
      list_provinsi:[],
      id_provinsi:11
    };
    this.props.navigator.setOnNavigatorEvent(this.navBarEvent.bind(this));
  }

  componentDidMount(){
    // axios.get(baseUrl+'getTokenS')
    // .then( (r) => {
    //   this.setState({ _token: r.data });
    // })
    // .catch(function (error) {
    //   ToastAndroid.show('network eror', ToastAndroid.SHORT);
    // });


  

  MessageBarManager.registerMessageBar(this.refs.alert);
    this.getListProvinsi();
  }

  componentWillUnmount() {
  // Remove the alert located on this master page from the manager
    MessageBarManager.unregisterMessageBar();
  }

  navBarEvent = (e) => {
    if (e.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (e.id == 'save') { // this is the same id field from the static navigatorButtons definition
        this.submitForm();
      }
    }
  };

  submitForm = () => {


    //alert('sdsdsds');


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


    Navigation.startSingleScreenApp({
        screen: {
          screen: 'RegisterPage', // unique ID registered with Navigation.registerScreen
          title: 'Login', // title of the screen as appears in the nav bar (optional)
          navigatorStyle: {
              navBarHidden: true // make the nav bar hidden
          }, // override the navigator style for the screen, see "Styling the navigator" below (optional)
          navigatorButtons: {} // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
        },
        passProps: {}, // simple serializable object that will pass as props to all top screens (optional)
        animationType: 'slide-down' // optional, add transition animation to root change: 'none', 'slide-down', 'fade'
    });

    axios({
      method: 'post',
      url: baseUrl+'signup',
      data: {
        nic: this.state.nik,
        username: this.state.username,
        password: this.state.password,
        name: this.state.nama,
        jenis_kelamin: this.state.jenis_kelamin,
        tempat_lahir: this.state.tempat_lahir,
        alamat: this.state.alamat,
        agama: this.state.agama,
        address: this.state.pekerjaan,
        mobilenumber: this.state.tlp,
        email: this.state.email,
        tanggal_lahir: this.state.tanggal_lahir,
        id_kota: this.state.id_kota
      },
      headers: {"X-CSRF-TOKEN": this.state._token}
    })
    .then( (r) => {
      if(r.data == true){
        ToastAndroid.show('Saved', ToastAndroid.SHORT);
        this.props.navigator.dismissModal({
          animationType: 'slide-down'
        });
      } else if(r.data == 2){
        //ToastAndroid.show('Use another NIK', ToastAndroid.SHORT);
      } else if(r.data == 3){
        //ToastAndroid.show('Use another Username', ToastAndroid.SHORT);
      } else if(r.data == 4){
        //ToastAndroid.show('Use another Email', ToastAndroid.SHORT);
      }
    })
    .catch(function (error) {
      //ToastAndroid.show('Error', ToastAndroid.SHORT);
    });
  }

  _openDatePicker = async () => {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        date: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {

      }
      if(action == DatePickerAndroid.dateSetAction){
        var d = year+'-'+(month+1)+'-'+day;
        this.setState({ tanggal_lahir: d });
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  };

  getListProvinsi = () => {
    axios.get(baseUrl+'listProvinsiS')
    .then( (r) => {
      this.setState({
        list_provinsi: r.data
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  getListKota = (id) => {
    this.setState({id_provinsi: id})
    axios.get(baseUrl+'listKotaS/'+id)
    .then( (r) => {
      this.setState({
        list_kota: r.data
      });
    })
    .catch(function (error) {
      console.log(error);
    });
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


  render() {
    return (

      <ScrollView
        style={{
            backgroundColor: '#ecf0f1'
          }} >
          <MessageBarAlert ref="alert" />

            <FormLabel>NIC no</FormLabel>
            <FormInput
              onChangeText={(nik) => this.setState({ nik })}
              keyboardType='default' />

            <FormLabel>Password</FormLabel>
            <FormInput
              onChangeText={(password) => this.setState({ password })}
                secureTextEntry={true}
              keyboardType='default' />
            <FormLabel>Name</FormLabel>
              <FormInput
                onChangeText={(nama) => this.setState({ nama })}
                keyboardType='default' />


            <View
              style={{
                    marginLeft:15
                  }} >
              <Icon
                raised
                size={20}
                name='date-range'
                color='#7f8c8d'
                onPress={() => this._openDatePicker()}
              />
              <Text >
                Birthday : {this.state.tanggal_lahir}
              </Text>
            </View>


            <FormLabel>Address</FormLabel>
            <FormInput
              onChangeText={(pekerjaan) => this.setState({ pekerjaan })}
              keyboardType='default' />
            <FormLabel>Mobile number</FormLabel>

              <FormInput
                onChangeText={(tlp) => this.setState({ tlp })}
                keyboardType='default' />

              <Button
                style={{flex: 1}}
                 containerViewStyle={{marginTop:10, borderRadius:22}}
                buttonStyle={{borderRadius:22, backgroundColor:'#35530A'}}
                title='Sign up'
                onPress={() => this.submitForm()} />
      </ScrollView>
    );
  }
}

export default Screen;
