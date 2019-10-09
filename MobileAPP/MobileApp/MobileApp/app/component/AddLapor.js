import React, { Component } from 'react';
import { View,Text, ToastAndroid,BackHandler,Dimensions,ScrollView,StyleSheet,Picker,DatePickerAndroid,TimePickerAndroid,Modal } from 'react-native';
import { Button,FormLabel,FormInput,Icon,List,ListItem,Card } from 'react-native-elements';
import axios from 'axios';
import { baseUrl } from '../helper/stuff';
import MapView from 'react-native-maps';
import {IconsMap, IconsLoaded} from '../helper/appIcon';
import ImagePicker from 'react-native-image-picker';

var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

let widthScreen = Dimensions.get('window').width; //full width
let heightScreen = Dimensions.get('window').height; //full height
const optionsImg = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
class Screen extends Component {

  static navigatorStyle = {
    navBarBackgroundColor: '#1abc9c'
  };

  constructor(props){
    super(props);
    this.state = {
      _token:'',
      id_kantor_polisi:'',
      nama_kantor_polisi:'',
      listKantorPolisi:[],
      judul:'',
      longitude:'',
      lattitude:'',

      waktu:'',
      alamat:'',
      t_pelaku:'',
      fotoBukti:'',
      t_korban:'',
      deskripsi_kejadian:'',
      list_kota:[],
      id_kota:'',
      id_provinsi:'',
      list_provinsi:[],
      list_kat_crime:[],
      id_kat_kriminalitas:'',
      labelProvinsi:'',
      labelKota:'',
      lat:'',
      long:'',
      tanggal_crime:'',
      jam_crime:'',
      waktu_crime:'',
      validationFormMessage:'',
      viewValidationMessage:[],
      modalVisible: false,
      modalMap: false,
      markerCrime: {latitude: 0,longitude: 0},
      region: {
        latitude: 6.9271,
        longitude: 79.8612,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      lastRegion: {
        latitude: 6.9271,
        longitude: 79.8612,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    };
    this.props.navigator.setOnNavigatorEvent(this.navBarEvent.bind(this));
    IconsLoaded;
  }

  componentDidMount(){
    // axios.get(baseUrl+'getTokenS')
    // .then( (r) => {
    //   this.setState({ _token: r.data });
    // })
    // .catch(function (error) {
    //   ToastAndroid.show('network eror', ToastAndroid.SHORT);
    // });
    // this.getListKantorPolisi();
    // this.getListProvinsi();
    // this.getKatCrime();

//     ImagePicker.showImagePicker(optionsImg, (response) => {
//
//   if (response.didCancel) {
//     alert('User cancelled image picker');
//   } else if (response.error) {
//     console.log('ImagePicker Error: ', response.error);
//   } else if (response.customButton) {
//       alert('User tapped custom button: ', response.customButton);
//   } else {
//     const source = { uri: response.uri };
//
//
//
//      // You can also display the image using data:
//     // const source = { uri: 'data:image/jpeg;base64,' + response.data };
//     //alert("SSS >"+response.data);
//     const data = new FormData();
//     data.append('name', 'testName'); // you can append anyone.
//
//     const config = { headers: { 'Content-Type': 'multipart/form-data' } };
//     let fd = new FormData();
//     fd.append('longitude',data.longitude)
//     fd.append('latitude',data.latitude)
//     fd.append('file',response.data)
//     return axios.post(baseUrl+'submitcrime', fd, config)
//
//
//
//     // axios({
//     //     method: 'post',
//     //     url: 'http://10.25.63.244:3007/submitcrime',
//     //     data: data,
//     //     config: { headers: {'Content-Type': 'multipart/form-data' }}
//     //     })
//     //     .then(function (response) {
//     //         //handle success
//     //         console.log(response);
//     //     })
//     //     .catch(function (response) {
//     //         //handle error
//     //         console.log(response);
//     //     });
//
//       this.setState({avatarSource:source})
//       // axios.post('http://10.25.63.244:3007/submitcrime',
//       // data:data,
//       //  config: { headers: {'Content-Type': 'multipart/form-data' }},
//       //  )
//       // .then(function(response){
//       //
//       // //alert('Submitted successfuly');
//       // //alert(JSON.stringify(qOb));
//       //
//       //  // if(response.data.Status=='SUCCESS'){
//       //  //    localStorage.setItem("securityToken", response.data.split(",")[1].split(":").substring(8));
//       //  //   this.setState({token:response.data.Token});
//       //  // }
//       //
//       //
//       // })
//       // .catch(function(error){
//       // console.log(JSON.stringify(error));
//       // });
//
//       // axios.post('http://10.25.63.244:3007/submitcrime',
//       //
//       // data,{ headers: { Authorization: '' } }
//       // )
//       // .then(function(response){
//       //
//       // //alert('Submitted successfuly');
//       // //alert(JSON.stringify(qOb));
//       //
//       //  // if(response.data.Status=='SUCCESS'){
//       //  //    localStorage.setItem("securityToken", response.data.split(",")[1].split(":").substring(8));
//       //  //   this.setState({token:response.data.Token});
//       //  // }
//       //
//       //
//       // })
//       // .catch(function(error){
//       // console.log(JSON.stringify(error));
//       // });
//
//   }
// });
  MessageBarManager.registerMessageBar(this.refs.alert);

  }
  componentWillUnmount() {
  // Remove the alert located on this master page from the manager
    MessageBarManager.unregisterMessageBar();
  }

  createFormData = (photo, body) => {
    const data = new FormData();

    data.append("photo", {
      name: photo.fileName,
      type: photo.type,
      uri:  photo.uri.replace("file://", "")
    });

    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });

    return data;
  };

  navBarEvent = (e) => {
    if (e.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (e.id == 'save') { // this is the same id field from the static navigatorButtons definition
        this.createLapor();
      }if ( e.id == 'crimePosition') {
        this.getLatLong();
      }
    }
  };

  createLapor = () =>{

    MessageBarManager.showAlert({
        title: '',
        message: 'The crime submitted succesfully',
        alertType: 'success',
    // See Properties section for full customization
    // Or check `index.ios.js` or `index.android.js` for a complete example
      });
  //  alert('ssss');
    if (false){
    //  ToastAndroid.show('tempat kejadian belum ditentukan', ToastAndroid.SHORT);
    }else{
      // axios({
      //   method: 'post',
      //   url: baseUrl+'createLaporS',
      //   data: {
      //     id_kantor_polisi: this.state.id_kantor_polisi,
      //     judul: this.state.judul,
      //     alamat: this.state.alamat,
      //     t_pelaku: this.state.t_pelaku,
      //     t_korban: this.state.t_korban,
      //     deskripsi_kejadian: this.state.deskripsi_kejadian,
      //     id_kota: this.state.id_kota,
      //     id_kat_kriminalitas: this.state.id_kat_kriminalitas,
      //     lat : this.state.lat,
      //     long: this.state.long,
      //     waktu: this.state.tanggal_crime+' '+this.state.jam_crime
      //   },
      //   headers: {"X-CSRF-TOKEN": this.state._token}
      // })
      // .then( (r) => {
      //   // send fcm
      //   var dataFcm = JSON.stringify({data:{idPengaduan:r.data},notification: { title: this.state.judul, body: this.state.alamat, sound: "default"}, to:"/topics/"+this.topics(this.state.nama_kantor_polisi)});
      //   axios({
      //     method: 'post',
      //     url: 'https://fcm.googleapis.com/fcm/send',
      //     data: dataFcm,
      //     headers: {
      //       "Content-type": "application/json",
      //       "Authorization":"key=AAAAU1c0Nxg:APA91bGESrQVcSBEDCPDVPNA9nkyJVO9lIbSVfG6QRZHqhlV3b1ictNxxr3Hv6RaDRuQ_JBL1msN-pq0zN_kc90fuuVyvCRxP32uIZe0FizQWhgZQMNwBhwYiuPlY-ezdEieY9MUiZbi"
      //     }
      //   })
      //   .then( (r) => {
      //     ToastAndroid.show('Saved', ToastAndroid.SHORT);
      //     this.props.navigator.dismissModal({
      //       animationType: 'slide-down'
      //     });
      //   })
      //   .catch( (error)=>{
      //     console.log(error);
      //   });
      // })
      // .catch( (error) => {
      //   // ToastAndroid.show('Error code: '+error.response.status.toString(), ToastAndroid.SHORT);
      //   this.setState({ viewValidationMessage: [] });
      //   var obj = error.response.data;
      //   for (const prop in obj) {
      //     this.state.viewValidationMessage.push(
      //       <Text key={prop}> {obj[prop]}</Text>
      //     )
      //     this.setState({ viewValidationMessage: this.state.viewValidationMessage });
      //   }
      //   this.setState({
      //     modalVisible: true
      //   });
      // });

  //    alert('ssdsd');


  //alert('submit crime');
  // const data = new FormData();
  // data.append('name', 'testName'); // you can append anyone.
  // data.append('photo', {
  //   uri: this.state.fotoBukti.uri,
  //   type: 'string/jpeg', // or photo.type
  //   name: 'testPhotoName'
  // });
  // data.append('longitude','sds')
  // data.append('latitude','sdsds')
  //
  // const config = { headers: { 'Content-Type': 'multipart/form-data' } };
  // let fd = new FormData();
  // fd.append('longitude','erer')
  // fd.append('latitude','ss')
  // fd.append('file',this.state.fotoBukti.data)
  //
  //
  //  axios.post(baseUrl+'submitcrime', fd, config)

  const data = new FormData();
  data.append('name', 'testName'); // you can append anyone.

  const config = { headers: { 'Content-Type': 'multipart/form-data' } };
  let fd = new FormData();
  fd.append('longitude',this.state.longitude)
  fd.append('latitude',this.state.latitude)
  fd.append('comment',this.state.judul)
  fd.append('address',this.state.alamat)


  fd.append('time',this.state.time)
  fd.append('date',this.state.date)

  fd.append('file',this.state.fotoBukti.data)
  axios.post('http://13.229.209.27:3007/'+'submitcrime', fd, config)


  axios.post('http://13.229.209.27:3009/notifyCrime',

  [
    { "longitude":this.state.longitude,"latitude":this.state.latitude,"comment":this.state.judul}

  ]
  ,{ headers: { Authorization: "" } })
  .then(function(response){



  })
  .catch(function(error){
  console.log(error.toString());
  });

  //alert("sss >"+this.state.judul);


   axios.post('http://13.229.209.27:4001/api/ReportedIncident',

  //
   {
          "$class": "org.policeincidentreporting.definition.ReportedIncident",
         "incidentID": "Incident 20190725011933"+(new Date().getTime()),
         "incidentType": this.state.judul,
         "data": "lon"+this.state.longitude+", lat"+this.state.latitude
   }
  //
  //
  //
   ,{ headers: {  } })
  .then(function(response){

    //alert("Response >"+JSON.stringify(response));
  })
  .catch(function(error){
  console.log(error.toString());
  });


  // fetch(baseUrl+'submitCrime', {
  //    method: "POST",
  //    body: this.createFormData(this.state.fotoBukti, { userId: "123" })
  //  })
  //    .then(response => response.json())
  //    .then(response => {
  //      console.log("upload succes", response);
  //      alert("Upload success!");
  //      this.setState({ photo: null });
  //    })
  //    .catch(error => {
  //      console.log("upload error", error);
  //      alert("Upload failed!");
  //    });

      // var data=new FormData();
      // data.append('id_kriminalitas','tst');
      // data.append('ket','sts');
      // data.append('foto', {
      //   uri: this.state.fotoBukti.uri,
      //   type: 'image/jpeg',
      //   name: 'dummy'
      // });







      // axios({
      //   method: 'post',
      //   url: baseUrl+'submitCrime',
      //   data
      //  })
      // .then( (r) => {
      //   if(r.data == true){
      //     ToastAndroid.show('Saved', ToastAndroid.SHORT);
      //     this.setState({
      //       modalAddBukti: false,
      //       ket: ''
      //     });
      //     this.getListBukti();
      //   }
      // })
      // .catch( (error) => {
      //   // ToastAndroid.show('Error', ToastAndroid.SHORT);
      //   // console.log(error.response.data);
      //   this.setState({ viewValidationMessage: [] });
      //   var obj = error.response.data;
      //   for (const prop in obj) {
      //     this.state.viewValidationMessage.push(
      //       <Text key={prop}> {obj[prop]}</Text>
      //     )
      //     this.setState({ viewValidationMessage: this.state.viewValidationMessage });
      //   }
      //   this.setState({
      //     modalValidation: true
      //   });
      // });
    }
  }

  getListKantorPolisi = () => {
    axios.get(baseUrl+'listKantorPolisiS')
    .then( (r) => {
      this.setState({
        listKantorPolisi: r.data
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

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

  getListKota = (id,index) => {
    this.setState({id_provinsi: id, labelProvinsi: this.state.list_provinsi[index].nama})
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

  getKatCrime = () => {
    axios.get(baseUrl+'listKatCrimeS')
    .then( (r) => {
      this.setState({
        list_kat_crime: r.data
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  // get lat long
  getLatLong = () => {
    this.setState({
      modalMap: true,
      region: this.state.lastRegion
    });

    // var address = this.state.alamat+' '+this.state.labelKota +' '+this.state.labelProvinsi;
    // var geoCodeUrl= 'http://maps.google.com/maps/api/geocode/json?address=';
    // axios.get(geoCodeUrl+address)
    // .then( (r) => {
    //   // console.log(r.data.results[0].geometry.location);
    //   var lat = r.data.results[0].geometry.location.lat;
    //   var long = r.data.results[0].geometry.location.lng;
    //   this.setState({
    //     lat: lat,
    //     long: long
    //   });
    //   ToastAndroid.show(address+'. Latitude: '+lat +', Longitude: '+long, ToastAndroid.LONG);
    // })
    // .catch(function (error) {
    //   ToastAndroid.show('Lengkapi Alamat, provinsi, kota', ToastAndroid.LONG);
    // });
  }

  markerCrime = (e) => {
    // ToastAndroid.show(JSON.stringify(e.nativeEvent.coordinate), ToastAndroid.LONG);
    this.setState({
      lat:e.nativeEvent.coordinate.latitude,
      long:e.nativeEvent.coordinate.longitude,
      markerCrime: e.nativeEvent.coordinate,
      lastRegion: {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    });
  }

  getTempatKejadian = (lat,long)=>{

    this.setState({longitude:long})
    this.setState({latitude:lat})

//    alert("Lat >"+lat+"   "+long);
    var url= 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+long+'&key=AIzaSyBmIoVBBNREisW3prcdsBCI0BGXHGzVdYA';
    axios.get(url)
    .then( (r) => {
      this.setState({
        alamat: r.data.results[0].formatted_address,
        modalMap: false
      });
      ToastAndroid.show('TKP didapatkan', ToastAndroid.LONG);
    })
    .catch( (error)=>{
      ToastAndroid.show('masalah jaringan atau coba pilih tempat lain, COBA LAGI.', ToastAndroid.LONG);
    });
  }

  posisiSaya = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // var lat = position.coords.latitude;
        // var long = position.coords.longitude;
        this.setState({
          lat: position.coords.latitude,
          long: position.coords.longitude,
          markerCrime: position.coords,
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
          lastRegion: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
        });
      },
      (error) => {
        ToastAndroid.show(error.message, ToastAndroid.SHORT)
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
    );
  }

  getPhotos = (action) => {
    let options = {
      title: 'Select Avatar',
      maxWidth: 200, // photos only
      maxHeight: 2000, // photos only
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else { // after pick foto
        switch(action){
            case 'add':
                this.setState({
                  fotoBukti: response,
                  modalAddBukti: true
                });
                this.textInputAddBuktiKet.focus();
                break;
            case 'edit':
                this.setState({
                  newFoto: 1,
                  fotoBukti: response,
                  uriEditFoto: 'file://'+response.path
                });
                break;
        }
      }
    });
  }

  // tanggal crime
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
        this.setState({ tanggal_crime: d });
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  };

  // jam crime
  _openTimePicker = async() => {
    try {
      const {action, hour, minute} = await TimePickerAndroid.open({

      });
      if (action !== TimePickerAndroid.dismissedAction) {
        var jam = hour +':'+ minute;
        this.setState({ jam_crime: jam });
      }
      if (action !== TimePickerAndroid.timeSetAction) {
        // canceled action
      }
    } catch ({code, message}) {
      console.warn('Cannot open time picker', message);
    }
  }

  topics = (str)=>{   // untuk send fcm
    str = str.split(" ");
    var arrLength = str.length;
    var name='';
    for (var i = 0; i < arrLength-1; i++) {
        name += str[i+1];
    }
    console.log(name);
    return name.toLowerCase();
    // str = str[0]+str[1];
    // console.log(str);
  }

  render() {
    return (
      <ScrollView
        style={{
           backgroundColor: '#ecf0f1',
           width: widthScreen,
           height: heightScreen
        }} >
        <MessageBarAlert ref="alert" />

            <FormLabel>Attention Police station</FormLabel>
            <FormInput
                onChangeText={(nama_kantor_polisi) => this.setState({ nama_kantor_polisi })}
                keyboardType='default' />
            <FormLabel>Comment</FormLabel>
            <FormInput
              onChangeText={(judul) => this.setState({ judul })}
              keyboardType='default' />
            <FormLabel>Address of the event</FormLabel>
            <FormInput
              multiline = {true}
              numberOfLines = {3}
              value={this.state.alamat}
              editable={false}/>




            <View
              style={{
                    marginLeft:15
                  }} >
              <Text >
                Date : {this.state.tanggal_crime}
              </Text>
              <Icon
                raised
                size={20}
                name='date-range'
                color='#7f8c8d'
                onPress={() => this._openDatePicker()}
              />
          </View>


          <View
              style={{
                    marginLeft:15
                  }} >
              <Text >
               Time : {this.state.jam_crime}
              </Text>
              <Icon
                raised
                size={20}
                name='access-time'
                color='#7f8c8d'
                onPress={() => this._openTimePicker()}
              />

          </View>

          <View
              style={{
                    marginLeft:15
                  }} >

                  <Text >
                   Upload picture evidence
                  </Text>
              <Icon
                name='image'
                color='#ffffff'
                underlayColor='rgba(0,0,0,0)'
                iconStyle={{marginRight:15}}
                onPress={() => this.getPhotos('edit')} />

                <Card
                  image={{uri:'file://'+this.state.fotoBukti.path}}
                  imageStyle={{height:475}}
                  >
                </Card>
          </View>


          <View>
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => console.log('close')}
              >
              <View
                style={{
                  backgroundColor:'rgba(0,0,0,0.7)',
                  flex:1,
                  }} >
                  <Icon
                    name='clear'
                    color='#ffffff'
                    iconStyle={{alignSelf:'flex-end'}}
                    onPress={() => this.setState({ modalVisible: false })} />
                      <Card title="Form Validation Message">
                        {this.state.viewValidationMessage}
                      </Card>
              </View>
            </Modal>
          </View>

          <View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalMap}
              onRequestClose={() => console.log('close')}
              >
                <View style ={styles.container}>
                  <MapView
                    initialRegion={this.state.region}
                    region={this.state.region}
                    provider='google'
                    style={styles.map}
                    showsUserLocation={true}
                    showsCompass={true}
                    followsUserLocation={true}
                    onLongPress={(e) => {this.markerCrime(e)}}
                    onRegionChange={(e) => {this.setState({region:e.nativeEvent})}}
                  >

                    <MapView.Marker
                      key={0}
                      coordinate={this.state.markerCrime}
                      title='tempat kejadian'
                      pinColor='blue'
                    />

                  </MapView>
                  <View
                    style={{
                      justifyContent:'flex-end',
                      flexDirection:'row',
                      marginTop: 5
                    }} >
                    <Icon
                      name='clear'
                      color='#000000'
                      underlayColor='rgba(0,0,0,0)'
                      iconStyle={{marginRight:15}}
                      onPress={() => this.setState({ modalMap: false })} />
                    <Icon
                      name='my-location'
                      color='#000000'
                      underlayColor='rgba(0,0,0,0)'
                      iconStyle={{marginRight:15}}
                      onPress={() => this.posisiSaya()} />
                    <Icon
                      name='done'
                      color='#000000'
                      underlayColor='rgba(0,0,0,0)'
                      iconStyle={{marginRight:15}}
                      onPress={() => this.getTempatKejadian(this.state.lat,this.state.long)} />
                  </View>
                </View>
            </Modal>
          </View>

      </ScrollView>
    );
  }
}

export default Screen;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});
