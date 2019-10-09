import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Card, CardBody, CardHeader, Col, Row, Table,  Form,
  FormGroup,
  FormText,Input,
  Label,
  ButtonGroup,
  Button,
  InputGroup } from 'reactstrap';

import usersData from './UsersData'
import { Bar, Doughnut, Line, Pie, Polar, Radar } from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { BootstrapTable, TableHeaderColumn,SizePerPageDropDown } from 'react-bootstrap-table';
import styled from 'styled-components';
import Modal from 'react-modal';
import 'react-bootstrap-table/css/react-bootstrap-table.css';
import { AppSwitch } from '@coreui/react'
import CsvCreator from 'react-csv-creator';

import C3Chart from "react-c3js";
import Util from '../../Util/Util';

const axios = require('axios');
const headers = [{
  id: 'comment',
  display: 'Question'
},
{
  id: 'user',
  display: 'User'
},
{
  id: 'timestamp',
  display: 'Timestamp'
}

];

export const StyledModal = styled(Modal)`
  position: relative;
  overflow: auto;
  outline: none;
  margin: auto;
  zIndex:-1;
  top: 0px;
  left: 0px;
  margin-top: '30%';
  background-color: white;
  right: 0px;
  bottom: 0px;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  width: 800px;
`;
const CustomStyles = {
  overlay: {
    backgroundColor: 'rgba(32, 40, 46, 0.5)',
    display: 'flex',
    'align-items': 'center',
  },
};
function UserRow(props) {
  const user = props.user
  const userLink = `/users/${user.id}`

  const getBadge = (status) => {
    return status === 'Active' ? 'success' :
      status === 'Inactive' ? 'secondary' :
        status === 'Pending' ? 'warning' :
          status === 'Banned' ? 'danger' :
            'primary'
  }



  return (
    <tr key={user.id.toString()}>
      <th scope="row"><Link to={userLink}>{user.id}</Link></th>
      <td><Link to={userLink}>{user.name}</Link></td>
      <td>{user.registered}</td>
      <td>{user.role}</td>
      <td><Link to={userLink}><Badge color={getBadge(user.status)}>{user.status}</Badge></Link></td>
    </tr>
  )
}



const options = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  scales: {
          xAxes: [{ barThickness: 2,scaleLabel: {
					display: true,
					labelString: 'Frequency'
				}, }],
          yAxes: [
        {
          gridLines: {
                lineWidth: 0
            },
            scaleLabel: {
  					display: true,
  					labelString: 'Amplitude'
  				}
        }
      ]
      },
  maintainAspectRatio: false
}

class Users extends Component {


  state = {
    barData:    {
        labels: ['50', '100', '150', '200', '250', '300', '350','400','450','500','550','600'],
        datasets: [
          {
            label: 'FFT',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: [65, 59, 80, 81, 56, 55, 40],

          },
        ],
      },
      questionData:[],

    fif: 0.001,
    hun: 0.0005,
    onefif: 0.0006,
    twoo: 0.0008,
    twofif: 0.0003,
    three: 0.000523,
    threefif: 0.00053,
    fourh: 0.000545,
    fourfif: 0.000532,
    fivehun: 0.000545,
    fivefif: 0.000554,
    sixh: 0.00054,
    question1Visible:'none',
    question2Visible:'none',
    question3Visible:'none',
    answer1:'',
    answer2:'',
    answer3:'',
    addQuestionVisible:false,
    editQuestionVisible:false,
    radioValue:"single",
    page:1,
    dataTotalSize:0,

    mcqCount:1,
   countListVisible:'none',
   questionStatus:"Active",
   editStatus:false,
   addQuestion:'',
  }

  addQuestionChange(e) {
    const obj=this;
     obj.setState({addQuestion:e.target.value});
   }

     handlePageChange(page, sizePerPage) {
       console.log("Changing page>"+page);
         const obj=this;
        obj.fetchData(page, sizePerPage);
     }
   fetchData(page = this.state.page, sizePerPage = this.state.sizePerPage) {
     const obj=this
     const AuthStr = 'Bearer '+localStorage.getItem("authToken");
     axios.get('http://54.169.251.70:8001/getquestions?offset='+((page-1)*10)+'&limit=10', { headers: { Authorization: AuthStr } })
   //  axios.get('http://54.169.43.175:8001/getquestions?offset='+5+'&limit=10', { headers: { Authorization: AuthStr } })
      .then(response => {
          // If request is good...
          var dataObject=response.data
        //  console.log(">>>>"+dataObject[0]);
           var questionD=[]

         for (var i = 0; i < dataObject.length; i++) {

             //var jsonObj=JSON.parse(dataObject[i])
              questionD.push({id:dataObject[i].qid,question:response.data[i].blob,type:response.data[i].type,status:response.data[i].status,answers:response.data[i].mcqAnswers})
            }

          this.setState({questionData:questionD});
       })
      .catch((error) => {
          console.log('error ' + error);
       });
   }
   componentDidMount(){

     axios.get('http://54.169.251.70:8001/getfeedback?offset=0&limit=10000', { headers: { Authorization: "" } })
      .then(response => {
       var dataObject= response.data

       //console.log(">sssdsds>>>"+dataObject.length);
        var questionD=[]
      //  console.log("Dat  a >"+JSON.stringify(obj));
      for (var i = 0; i < dataObject.length; i++) {
        var obj=dataObject[i]

          //var jsonObj=JSON.parse(dataObject[i])
          questionD.push({comment:obj.blob,user:obj.username,timestamp:Util.getFormattedTime(obj.timestamp)})
         }



     this.setState({csvData:questionD});
        //console.log(">sssdsds>>>"+dataObject.length);


       this.setState({dataTotalSize:dataObject.length});
       })
      .catch((error) => {
        });



     axios.get('http://54.169.251.70:8001/getfeedback?offset=0&limit=10', { headers: { Authorization: "" } })
      .then(response => {
       var dataObject= response.data
       // alert(JSON.stringify(response))

        //console.log(">sssdsds>>>"+dataObject.length);
         var questionD=[]
       //  console.log("Data >"+JSON.stringify(obj));
       for (var i = 0; i < dataObject.length; i++) {
         var obj=dataObject[i]

           //var jsonObj=JSON.parse(dataObject[i])
           questionD.push({id:obj.qid,question:obj.question,comment:obj.blob,user:obj.username,timestamp:Util.getFormattedTime(obj.timestamp)})
          }

       this.setState({questionData:questionD});
       })
      .catch((error) => {
        });




   }

   addQuestion(){

      this.setState({addQuestionVisible:true});
      this.setState({radioValue:"single"});
      this.setState({addQuestion:""});

      this.setState({countListVisible:'none'});
      this.setState({question1Visible:'none'});
       this.setState({question2Visible:'none'});
      this.setState({question3Visible:'none'});

      this.setState({answer1:''});
       this.setState({answer2:''});
      this.setState({answer3:''});

   }
   cancelAddQuestion(){

      this.setState({addQuestionVisible:false});
   }
   cancelEditQuestion(){

      this.setState({editQuestionVisible:false});
   }


   editQuestion(){
      this.setState({editQuestionVisible:true});
   }
   cancelEditQuestion(){

      this.setState({editQuestionVisible:false});
   }

   editQuestionType(value){

     this.setState({radioValue:value})

     if(value=="multiple"){
       this.setState({question1Visible:''});
       this.setState({ countListVisible:'' });

     }else{
       this.setState({mcqCount:1});
       this.setState({ countListVisible:'none' });

       this.setState({question1Visible:'none'});
       this.setState({question2Visible:'none'});
       this.setState({question3Visible:'none'});

     }


   }

   changeAnswerCount(count){

     this.setState({mcqCount:count})

     if(count==1 ){
         this.setState({question1Visible:''});
         this.setState({question2Visible:'none'});
         this.setState({question3Visible:'none'});

     }
     if(count ==2 ){

         this.setState({question1Visible:''});
         this.setState({question2Visible:''});
         this.setState({question3Visible:'none'});
     }

     if(count== 3 ){
         this.setState({question1Visible:''});
         this.setState({question2Visible:''});
         this.setState({question3Visible:''});

     }

   }

   onChangeStatusSelect(status){
     this.setState({questionStatus:status});
   }

   onOKClick(){
     const obj=this;

     var qType="short answer"
     // alert(">>>"+(obj.state.radioValue=="single"))
     if(obj.state.radioValue=="single"){
       qType="short answer"
     }else{

       qType="mcq"
     }
      const AuthStr = 'Bearer '+localStorage.getItem("authToken");
     var ansArray=[]
     var answerString=""
     if(qType=="mcq"){


       alert('Question >'+this.state.answer1+"  "+this.state.answer2+" "+this.state.answer3);
       if(this.state.answer1 != ""){
         answerString=this.state.answer1
        }

       if(this.state.answer2 != ""){
         answerString=answerString+"|"+this.state.answer2
       }

       if(this.state.answer3 != ""){
         answerString=answerString+"|"+this.state.answer3

        }
     }

     this.setState({addQuestionVisible:false});

     //alert("Answer string >"+answerString);
     obj.setState({failureWarning:true});

     //console.log("???????  "+JSON.stringify( { "qid":qID,  "blob":this.state.addQuestion,  "timestamp":new Date().getTime()+"", "status":this.state.questionStatus,  "type":qType,"mcqanswers":this.state.answer1+"|"+this.state.answer2+"|"+this.state.answer3}));
        var qID=(new Date().getTime()+"").substring(8,12)+""
     //
           axios.post('http://54.169.251.70:8001/postquestions',

          [
             { "qid":qID,  "blob":obj.state.addQuestion,  "timestamp":new Date().getTime()+"", "status":obj.state.questionStatus,  "type":qType,"mcqanswers":answerString}

           ]
       ,{ headers: { Authorization: AuthStr } })
         .then(function(response){

         obj.setState({addQuestionVisi:false});
         obj.setState({addQuestion:''});


         })
         .catch(function(error){
         console.log(error.toString());
         });






      this.setState({addQuestionVisi:false})
      this.setState({addQuestion:''});

      this.setState({answer1:''});
      this.setState({answer2:''});
      this.setState({answer3:''});
      this.setState({radioValue:"single"});
      this.setState({question1Visible:'none'});
       this.setState({question2Visible:'none'});
      this.setState({question3Visible:'none'});

       setTimeout(function () {

     //   alert('timeot');

        const AuthStr = 'Bearer '+localStorage.getItem("authToken");
        axios.get('http://54.169.251.70:8001/getquestions?offset='+10*(obj.state.page-1)+'&limit=10'  , { headers: { Authorization: AuthStr } })
         .then(response => {
             // If request is good...
             var dataObject=response.data
           //  console.log(">>>>"+dataObject[0]);
              var questionD=[]

            for (var i = 0; i < dataObject.length; i++) {

                //var jsonObj=JSON.parse(dataObject[i])

                 questionD.push({id:dataObject[i].qid,question:response.data[i].blob,type:response.data[i].type,status:response.data[i].status,answers:response.data[i].mcqAnswers})
               }

             obj.setState({questionData:questionD});
          })
         .catch((error) => {
             console.log('error ' + error);
          });


                axios.get('http://54.169.251.70:8001/getquestionscount', { headers: { Authorization: AuthStr } })
                 .then(response => {
                     // If request is good...

                       obj.setState({totalSize:response.data});
                  })
                 .catch((error) => {
                     console.log('error ' + error);
                  });


        }, 2000);


   }

   deleteQs(){


     const AuthStr = 'Bearer '+localStorage.getItem("authToken");
     const obj=this;

     obj.setState({editQuestionVisible:false});
     //alert("Delete q Coutn >"+obj.state.deleteQs);
       axios.post('http://54.169.251.70:8001/deletequestion?qId='+obj.state.deleteQs,[], { headers: { Authorization: AuthStr } })
        .then(response => {
          setTimeout(function () {

          //   alert('timeot');

          axios.get('http://54.169.251.70:8001/getquestions?offset=0&limit=10', { headers: { Authorization: AuthStr } })
          .then(response => {
              // If request is good...
               var dataObject=response.data
                 var questionD=[]

              for (var i = 0; i < dataObject.length; i++) {

                  //var jsonObj=JSON.parse(dataObject[i]
                   questionD.push({id:dataObject[i].qid,question:response.data[i].blob,type:response.data[i].type,status:response.data[i].status,answers:response.data[i].mcqAnswers})
                 }

               obj.setState({questionData:questionD});
           })
          .catch((error) => {
              console.log('error ' + error);
           });


           axios.get('http://54.169.251.70:8001/getquestionscount', { headers: { Authorization: AuthStr } })
            .then(response => {
                // If request is good...
                  obj.setState({totalSize:response.data});
             })
            .catch((error) => {
                console.log('error ' + error);
             });

           }, 2000);

          })
        .catch((error) => {
            console.log('error ' + error);
         });


   }

   handleExpand(rowKey, isExpand){

     this.setState({addQuestion:rowKey.question});
     //
     this.setState({editQuestionVisible:true});
     this.setState({editStatus:false});
     //
     this.setState({deleteQs:rowKey.id});
     //
     // //   alert('>>>'+JSON.stringify(rowKey));
     //

       if(rowKey.status=="Active"){
         this.setState({questionStatus:"Active"});



       }else{
         this.setState({questionStatus:"Inactive"});


       }
       this.setState({question1Visible:'none'});
       this.setState({question2Visible:'none'});
       this.setState({question3Visible:'none'});
       if(rowKey.type=="mcq"){
      this.setState({radioValue:"multiple"});
      this.setState({countListVisible:''});

      if(rowKey.answers != undefined){
        var ques=rowKey.answers.split("|");
        this.setState({mcqCount:ques.length})
         if(ques.length==1 ){

          this.setState({question1Visible:''});

          this.setState({answer1:ques[0]});
        }

         if(ques.length==2){
           this.setState({question1Visible:''});
            this.setState({question2Visible:''});
           this.setState({answer1:ques[0]});
           this.setState({answer2:ques[1]});

         }


        if(ques.length==3){
          this.setState({question1Visible:''});
           this.setState({question2Visible:''});
          this.setState({question3Visible:''});

          this.setState({answer1:ques[0]});
          this.setState({answer2:ques[1]});
          this.setState({answer3:ques[2]});

        }
      }
     //
     //
     }else{
     //
      this.setState({countListVisible:'none'});
      this.setState({radioValue:"single"})
     //
     }




   }

   onEditQuestionOK(){


     const obj=this;

     var qType="short answer"
     // alert(">>>"+(obj.state.radioValue=="single"))
     if(obj.state.radioValue=="single"){
       qType="short answer"
     }else{

       qType="mcq"
     }
     console.log("qTYPE >"+qType);
     const AuthStr = 'Bearer '+localStorage.getItem("authToken");
     var ansArray=[]
     var answerString=""
     if(qType=="mcq"){

       if(this.state.answer1 != ""){
         answerString=this.state.answer1
        }

       if(this.state.answer2 != ""){
         answerString=answerString+"|"+this.state.answer2
       }

       if(this.state.answer3 != ""){
         answerString=answerString+"|"+this.state.answer3

        }
     }
     //alert("Answer string >"+answerString);
     this.setState({editStatus:true});

     //console.log("???????  "+JSON.stringify( { "qid":qID,  "blob":this.state.addQuestion,  "timestamp":new Date().getTime()+"", "status":this.state.questionStatus,  "type":qType,"mcqanswers":this.state.answer1+"|"+this.state.answer2+"|"+this.state.answer3}));
     console.log("--->"+JSON.stringify( { "qid":qID,  "blob":this.state.addQuestion,  "timestamp":new Date().getTime()+"", "status":this.state.questionStatus,  "type":qType,"mcqanswers":this.state.answer1+"|"+this.state.answer2+"|"+this.state.answer3}))
       var qID=(new Date().getTime()+"").substring(8,12)+""
     //
           axios.post('http://54.169.251.70:8001/updatquestion?qId='+obj.state.deleteQs,

          [
             { "qid":qID,  "blob":this.state.addQuestion,  "timestamp":new Date().getTime()+"", "status":this.state.questionStatus,  "type":qType,"mcqanswers":answerString}

           ]
       ,{ headers: { Authorization: AuthStr } })
         .then(function(response){

         this.setState({modalVisible:false});
         this.setState({addQuestion:''});


         })
         .catch(function(error){
         console.log(error.toString());
         });


      this.setState({editQuestionVisible:false})
      this.setState({modalVisible:false})
      this.setState({addQuestion:''});

      this.setState({answer1:''});
      this.setState({answer2:''});
      this.setState({answer3:''});
      this.setState({radioValue:"single"});
      this.setState({question1Visible:'none'});
       this.setState({question2Visible:'none'});
      this.setState({question3Visible:'none'});

       setTimeout(function () {

     //   alert('timeot');

        const AuthStr = 'Bearer '+localStorage.getItem("authToken");
        axios.get('http://54.169.251.70:8001/getquestions?offset='+10*(obj.state.page-1)+'&limit=10'  , { headers: { Authorization: AuthStr } })
         .then(response => {
             // If request is good...
             var dataObject=response.data
           //  console.log(">>>>"+dataObject[0]);
              var questionD=[]

            for (var i = 0; i < dataObject.length; i++) {

                //var jsonObj=JSON.parse(dataObject[i])

                 questionD.push({id:dataObject[i].qid,question:response.data[i].blob,type:response.data[i].type,status:response.data[i].status,answers:response.data[i].mcqAnswers})
               }

             obj.setState({questionData:questionD});
          })
         .catch((error) => {
             console.log('error ' + error);
          });



                axios.get('http://54.169.251.70:8001/getquestionscount', { headers: { Authorization: AuthStr } })
                 .then(response => {
                     // If request is good...
                       console.log(">>>>"+response.data);

                       this.setState({totalSize:response.data});
                  })
                 .catch((error) => {
                     console.log('error ' + error);
                  });


        }, 2000);

    }



    answer1Change(e) {
      const obj=this;
      obj.setState({answer1:e.target.value});

     }
     answer2Change(e) {
       const obj=this;
       obj.setState({answer2:e.target.value});

      }
      answer3Change(e) {
        const obj=this;
        obj.setState({answer3:e.target.value});

       }


  generateRandomNumber() {

        const obj=this;

         var temp=obj.state.barData;


         var dataArray=[]

         for(var i=0;i<12;i++){

           dataArray.push( Math.random() * (0.00125 - 0) + 0)
         }

          temp.datasets[0].data=dataArray;

         obj.setState({barData:temp})

      //alert(highlightedNumber);
  };
  render() {


    const MAX_HEIGHT = 600;
    const ROW_HEIGHT = 42;

    const obj=this;

    const options = {
            sizePerPageList : [1],
            onRowClick: obj.handleExpand.bind(this),
            onPageChange:this.handlePageChange.bind(this),
           page: obj.state.currentPage,
           sizePerPage: obj.state.sizePerPage,
          };
    const userList = usersData.filter((user) => user.id < 10)

    return (
      <div className="animated fadeIn">
        <StyledModal  isOpen={this.state.addQuestionVisible}effect="fadeInUp" alignItems="center"   height="auto" style={{backgroundColor:'red',width:"800",height:"auto",fontFamily:'sdsds'}}  style={ CustomStyles }  >
          <h5 style={{paddingTop:2,paddingBottom:2,marginLeft:'2%',marginTop:'3%'}}>Add Question</h5>
          <CardBody>

            <FormGroup>
              <Label htmlFor="company">Question</Label>
              <Input type="text" id="company" placeholder="The question to be entered" value={this.state.addQuestion}   onChange={this.addQuestionChange.bind(this)} />
            </FormGroup>
            <FormGroup>
              <Row>
                <Col xs="3">
                  <Label htmlFor="city">Type</Label>

                  <FormGroup>
                    <ButtonGroup>
                        <Button className="btn btn-outline-primary" onClick={() => this.editQuestionType("single")} active={this.state.radioValue === "single"} >Single</Button>
                        <Button className="btn btn-outline-primary"  onClick={() => this.editQuestionType("multiple")} active={this.state.radioValue === "multiple"}>Multiple</Button>
                    </ButtonGroup>

                   </FormGroup>
                </Col>
                <Col xs="3" style={{display:this.state.countListVisible}}>
                  <Label htmlFor="city">Answer count</Label>

                  <FormGroup>
                    <ButtonGroup>
                        <Button className="btn btn-outline-primary" onClick={() => this.changeAnswerCount(1)} active={this.state.mcqCount === 1}  >1</Button>
                        <Button className="btn btn-outline-primary"  onClick={() => this.changeAnswerCount(2)} active={this.state.mcqCount === 2}>2</Button>
                          <Button className="btn btn-outline-primary" onClick={() => this.changeAnswerCount(3)} active={this.state.mcqCount === 3} >3</Button>

                    </ButtonGroup>

                   </FormGroup>
                </Col>
                <Col xs="3">
                  <Label htmlFor="city">Status</Label>

                  <FormGroup>
                      <ButtonGroup>
                        <Button className="btn btn-outline-primary" onClick={() => this.onChangeStatusSelect("Active")} active={this.state.questionStatus === "Active"} >Active</Button>
                        <Button className="btn btn-outline-primary"  onClick={() => this.onChangeStatusSelect("Inactive")} active={this.state.questionStatus === "Inactive"}>Inactive</Button>
                                     </ButtonGroup>

                  </FormGroup>
                </Col>

              </Row>


            </FormGroup>
            <FormGroup style={{display:this.state.question1Visible}}>
              <Label htmlFor="street">Answer 1</Label>
              <Input type="text" id="street" placeholder="Enter answer 1"   value={this.state.answer1}   onChange={this.answer1Change.bind(this)} />
            </FormGroup>

            <FormGroup style={{display:this.state.question2Visible}}>
              <Label htmlFor="street">Answer 2</Label>
              <Input type="text" id="street" placeholder="Enter answer 2" value={this.state.answer2}  onChange={this.answer2Change.bind(this)} />
            </FormGroup>
            <FormGroup style={{display:this.state.question3Visible}}>
              <Label htmlFor="street">Answer 3</Label>
              <Input type="text" id="street" placeholder="Enter answer 3"  value={this.state.answer3}  onChange={this.answer3Change.bind(this)} />
            </FormGroup>
            <Row>
              <Col xs="2" style={{marginLeft:'44%'}}>
                  <Button type="submit" size="sm" color="warning" style={{width:200}} onClick={this.cancelAddQuestion.bind(this)}><i className="fa fa-dot-circle-o"></i> Cancel</Button>
              </Col>
              <Col xs="2" style={{marginLeft:'10.5%'}}>
                <Button type="submit" size="sm" color="primary" style={{width:200}} onClick={this.onOKClick.bind(this)}><i className="fa fa-dot-circle-o"></i> OK</Button>
              </Col>
            </Row>



          </CardBody>

        </StyledModal>

        <StyledModal  isOpen={this.state.editQuestionVisible}effect="fadeInUp" alignItems="center"   height="auto" style={{backgroundColor:'red',width:"800",height:"auto",fontFamily:'sdsds'}}  style={ CustomStyles }  >
          <h5 style={{paddingTop:2,paddingBottom:2,marginLeft:'2%',marginTop:'3%'}}>Edit Question</h5>
          <CardBody>

            <FormGroup>
              <Label htmlFor="company">Question</Label>
              <Input type="text" id="company" placeholder="The question to be entered" value={this.state.addQuestion}   onChange={this.addQuestionChange.bind(this)} />
            </FormGroup>
            <FormGroup>
              <Row>
                <Col xs="3">
                  <Label htmlFor="city">Type</Label>

                  <FormGroup>
                    <ButtonGroup>
                        <Button className="btn btn-outline-primary" onClick={() => this.editQuestionType("single")} active={this.state.radioValue === "single"} >Single</Button>
                        <Button className="btn btn-outline-primary"  onClick={() => this.editQuestionType("multiple")} active={this.state.radioValue === "multiple"}>Multiple</Button>
                    </ButtonGroup>

                   </FormGroup>
                </Col>
                <Col xs="3" style={{display:this.state.countListVisible}}>
                  <Label htmlFor="city">Answer count</Label>

                  <FormGroup>
                    <ButtonGroup>
                        <Button className="btn btn-outline-primary" onClick={() => this.changeAnswerCount(1)} active={this.state.mcqCount === 1}  >1</Button>
                        <Button className="btn btn-outline-primary"  onClick={() => this.changeAnswerCount(2)} active={this.state.mcqCount === 2}>2</Button>
                          <Button className="btn btn-outline-primary" onClick={() => this.changeAnswerCount(3)} active={this.state.mcqCount === 3} >3</Button>

                    </ButtonGroup>

                   </FormGroup>
                </Col>
                <Col xs="3">
                  <Label htmlFor="city">Status</Label>

                  <FormGroup>
                      <ButtonGroup>
                        <Button className="btn btn-outline-primary" onClick={() => this.onChangeStatusSelect("Active")} active={this.state.questionStatus === "Active"} >Active</Button>
                        <Button className="btn btn-outline-primary"  onClick={() => this.onChangeStatusSelect("Inactive")} active={this.state.questionStatus === "Inactive"}>Inactive</Button>
                                     </ButtonGroup>

                  </FormGroup>
                </Col>

              </Row>
              <FormGroup style={{display:this.state.question1Visible}}>
                <Label htmlFor="street">Answer 1</Label>
                <Input type="text" id="street" placeholder="Enter answer 1"   value={this.state.answer1}   onChange={this.answer1Change.bind(this)} />
              </FormGroup>

              <FormGroup style={{display:this.state.question2Visible}}>
                <Label htmlFor="street">Answer 2</Label>
                <Input type="text" id="street" placeholder="Enter answer 2" value={this.state.answer2}  onChange={this.answer2Change.bind(this)} />
              </FormGroup>
              <FormGroup style={{display:this.state.question3Visible}}>
                <Label htmlFor="street">Answer 3</Label>
                <Input type="text" id="street" placeholder="Enter answer 3"  value={this.state.answer3}  onChange={this.answer3Change.bind(this)} />
              </FormGroup>

            </FormGroup>

            <Row>
              <Col xs="2" style={{marginLeft:'17%'}}>
                  <Button type="submit" size="sm" color="danger" style={{width:200}} onClick={this.deleteQs.bind(this)}><i className="fa fa-dot-circle-o"></i> Delete</Button>
              </Col>
              <Col xs="2" style={{marginLeft:'11%'}}>
                  <Button type="submit" size="sm" color="danger" style={{width:200}} onClick={this.cancelEditQuestion.bind(this)}><i className="fa fa-dot-circle-o"></i> Cancel</Button>
              </Col>
              <Col xs="2" style={{marginLeft:'10.5%'}}>
                <Button type="submit" size="sm" color="primary" style={{width:200}} onClick={this.onEditQuestionOK.bind(this)}><i className="fa fa-dot-circle-o"></i> OK</Button>
              </Col>
            </Row>



          </CardBody>

        </StyledModal>
        <Row>

        <Col xs="12" lg="12">
          <Card>
            <CardHeader>
              User View
             </CardHeader>
            <CardBody>
            <BootstrapTable  height={String(Math.min([MAX_HEIGHT, (this.state.questionData.length + 1) * ROW_HEIGHT]))} data={this.state.questionData}    remote={ true }  options={options}  pagination  condensed fetchInfo={ { dataTotalSize: 1 }}    >

              <TableHeaderColumn   dataField="comment" isKey={false}  width="50%"  dataAlign="left"  >Comment</TableHeaderColumn>
                   <TableHeaderColumn dataField="user" isKey={false}  width="20%"  dataAlign="left"   >User</TableHeaderColumn>
                  <TableHeaderColumn dataField="timestamp"  isKey={true}  width="20%"  dataAlign="left"   >Timestamp</TableHeaderColumn>

                </BootstrapTable>
                <CsvCreator
                filename={"Feedbacks "+Util.getFormattedTime(new Date().getTime())}
                 headers={headers}
                rows={this.state.csvData}
                >
                <  Button className="btn btn-secondary" style={{width:200,backgroundColor:'transparent',marginLeft:20,marginBottom:20}} >Download</ Button>


                </CsvCreator>
            </CardBody>

          </Card>
        </Col>

        </Row>

      </div>
    )
  }
}

export default Users;
