import React, { Component } from 'react';
import { View,Text, ToastAndroid,BackHandler,StyleSheet } from 'react-native';
import { Button,Icon } from 'react-native-elements';
import axios from 'axios';
import MapView,{ Marker } from 'react-native-maps';
import firebase from 'react-native-firebase';

class Screen extends Component {

  constructor(props){
    super(props);
    this.state = {
      _token:'',
      regLat:6.9271,
      regLong:79.8612,
      markerLat:6.9271,
      markerLon:79.8612,
      attention:'',
      message:''
    };
  }
  componentDidMount(){

    const obj=this;
    firebase.messaging().getToken()
    .then((fbToken)=>{


      axios({
        method: 'post',
        url: 'http://13.229.209.27:3009/'+'updateToken',
        data: {
          token: fbToken,

        },
        headers: {}
      })
      .then( (r) => {
        // if(r.data == true){
        //   ToastAndroid.show('Saved', ToastAndroid.SHORT);
        //   this.props.navigator.dismissModal({
        //     animationType: 'slide-down'
        //   });
        // } else if(r.data == 2){
        //   ToastAndroid.show('Use another NIK', ToastAndroid.SHORT);
        // } else if(r.data == 3){
        //   ToastAndroid.show('Use another Username', ToastAndroid.SHORT);
        // } else if(r.data == 4){
        //   ToastAndroid.show('Use another Email', ToastAndroid.SHORT);
        // }
      })
      .catch(function (error) {
      //  ToastAndroid.show('Error', ToastAndroid.SHORT);
      });





      console.log("Token >"+fbToken)
      firebase.database().ref("masyarakat").child(this.props.userNik).set({
        id: this.props.userNik,
        token: fbToken
      });
    });



    // handle receive fcm
    firebase.messaging().onMessage((payload)=>{

      // when apps running


 //alert(' message'+JSON.stringify(payload))

      if(payload.my_key=="crimeAlert"){
    //

          obj.setState({message:payload.comment});
          obj.setState({markerLat:parseInt(payload.locationLat)});
          obj.setState({markerLon:parseInt(payload.locationLon)});
          obj.setState({attention:'Attention'});

        //  obj.setState({markerLon:112.752193});


      }



      // if(payload){
      //
      // }
    });
  }

  respond = () => {
    // axios({
    //   method: 'post',
    //   url: baseUrl+'signup',
    //   data: {
    //     nik: this.state.nik,
    //     username: this.state.username,
    //     password: this.state.password,
    //     nama: this.state.nama,
    //     jenis_kelamin: this.state.jenis_kelamin,
    //     tempat_lahir: this.state.tempat_lahir,
    //     alamat: this.state.alamat,
    //     agama: this.state.agama,
    //     pekerjaan: this.state.pekerjaan,
    //     tlp: this.state.tlp,
    //     email: this.state.email,
    //     tanggal_lahir: this.state.tanggal_lahir,
    //     id_kota: this.state.id_kota
    //   },
    //   headers: {"X-CSRF-TOKEN": this.state._token}
    // })
    // .then( (r) => {
    //   if(r.data == true){
    //     ToastAndroid.show('Saved', ToastAndroid.SHORT);
    //     this.props.navigator.dismissModal({
    //       animationType: 'slide-down'
    //     });
    //   } else if(r.data == 2){
    //     ToastAndroid.show('Use another NIK', ToastAndroid.SHORT);
    //   } else if(r.data == 3){
    //     ToastAndroid.show('Use another Username', ToastAndroid.SHORT);
    //   } else if(r.data == 4){
    //     ToastAndroid.show('Use another Email', ToastAndroid.SHORT);
    //   }
    // })
    // .catch(function (error) {
    // //  ToastAndroid.show('Error', ToastAndroid.SHORT);
    // });
    alert('resp');
  }
  render() {

    return (
    <View style ={styles.container}>
        <MapView
          region={{
            latitude: this.state.regLat,
            longitude: this.state.regLong,
            latitudeDelta: 0.015*100,
            longitudeDelta: 0.0121*100,
          }}
          provider='google'
          style={styles.map}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          followsUserLocation={true}
        >
        <Marker
             coordinate={{
  latitude: this.state.markerLat,
  longitude: this.state.markerLon,
}}
             title={this.state.attention}
             description={this.state.message}
           />
        </MapView>
        <Button
          raised
          containerViewStyle={{marginTop:10, borderRadius:22}}
          buttonStyle={{borderRadius:22, backgroundColor:'#35530A'}}
          title='Respond'
              onPress={() => this.respond()}
         />
        <View
          style={{
            alignItems: 'flex-end'
          }}
        >
          <Icon
            raised
            size={20}
            name='refresh'
            color='#7f8c8d'
          />
        </View>
      </View>
    );
  }
}

export default Screen;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

      justifyContent: 'flex-end',

    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    }
  });
