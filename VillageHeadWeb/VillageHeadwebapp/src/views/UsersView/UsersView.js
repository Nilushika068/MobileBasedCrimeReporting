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
import Util from '../../Util/Util';
const axios = require('axios');

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

const headers = [{
  id: 'question',
  display: 'Question'
}, {
  id: 'answer',
  display: 'Answer'
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
	search:'',
    answer1:'',
    answer2:'',
    answer3:'',
    addQuestionVisible:false,
    editQuestionVisible:false,
    radioValue:"single",
    page:1,
    csvData:[],

    mcqCount:1,
    userCount:0,
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



         var questionD=[]
         const obj=this;

         const AuthStr = 'Bearer '+localStorage.getItem("authToken");

         axios.post('http://127.0.0.1:3009/getAllCitizens')
         .then(function(response){

           console.log("Response >"+JSON.stringify(response))
            var dataObject=response.data
         // //  console.log(">>>>"+dataObject[0]);
           obj.setState({userCount:response.data.length})
            var questionD=[]

          for (var i = 0; i < dataObject.length; i++) {

              //var jsonObj=JSON.parse(dataObject[i])

               questionD.push({nic:dataObject[i].NIC,name:response.data[i].Name,address:response.data[i].Address})
             }

           obj.setState({questionData:questionD});


         })
         .catch(function(error){
           //alert(error)
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

     this.setState({addQuestion:rowKey.name});
     //
     this.setState({editQuestionVisible:true});
     this.setState({editStatus:false});
     //
     this.setState({deleteQs:rowKey.nic});
	 
	 //this.setState({onSearch:rowKey.name})

   }
   
   // popup cancel
   onEditCancel(){
	  
	   const obj=this;
     obj.setState({editQuestionVisible:false});
	   
   }
   
   //onsearch citizen
    onSearch(){
		const obj=this;
     obj.setState({editQuestionVisible:false});
		
	  axios.post('http://127.0.0.1:3009/searchUsers',[{name:obj.state.addQuestion}])
	 // alert("testing")
	 
	     
   } 
   
   onEditQuestionOK(){


     const obj=this;
     obj.setState({editQuestionVisible:false});


     axios.post('http://127.0.0.1:3009/updateCitizen',[{nic:obj.state.deleteQs}], { headers: { Authorization: "" } })
      .then(response => {
        setTimeout(function () {

        //   alert('timeot');
        axios.post('http://127.0.0.1:3009/getAllCitizens')
        .then(function(response){

          console.log("Response >"+JSON.stringify(response))
           var dataObject=response.data
        // //  console.log(">>>>"+dataObject[0]);
          obj.setState({userCount:response.data.length})
           var questionD=[]

         for (var i = 0; i < dataObject.length; i++) {

             //var jsonObj=JSON.parse(dataObject[i])

              questionD.push({nic:dataObject[i].NIC,name:response.data[i].Name,address:response.data[i].Address})
            }

          obj.setState({questionData:questionD});


        })
        .catch(function(error){
          //alert(error)
        });



         }, 2000);

        })
      .catch((error) => {
          console.log('error ' + error);
       });

    }



    answer1Change(e) {
      const obj=this;
      obj.setState({answer1:e.target.value});

     }
//<Button type="submit" size="sm" color="primary" style={{width:200}} onClick={this.onEditCancel.bind(this)}><i className="fa fa-dot-circle-o"></i> Cancel</Button>
              
     answer2Change(e) {
       const obj=this;
       obj.setState({answer2:e.target.value});

      }
      answer3Change(e) {
        const obj=this;
        obj.setState({answer3:e.target.value});

       }
//<Input type="text" id="company" placeholder="Search Users" value={this.state.addQuestionChange}   onChange={this.addQuestionChange.bind(this)} />
//<Button type="submit" size="sm" color="primary" style={{width:200}} onClick={this.onSearch.bind(this)}><i className="fa fa-dot-circle-o"></i>Search</Button>

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
			<Input type="text" id="company" placeholder="The question to be entered" value={this.state.deleteQs}   onChange={this.addQuestionChange.bind(this)} />
            <FormGroup>
              <Label htmlFor="company">Name</Label>
              <Input type="text" id="company" placeholder="The question to be entered" value={this.state.addQuestion}   onChange={this.addQuestionChange.bind(this)} />
            </FormGroup>
			
			
            <FormGroup>
              <Row>
                <Col xs="3">
                  <Label htmlFor="city">Address</Label>

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


                </Col>

              </Row>


            </FormGroup>




          </CardBody>

        </StyledModal>

        <StyledModal  isOpen={this.state.editQuestionVisible}effect="fadeInUp" alignItems="center"   height="auto" style={{backgroundColor:'red',width:"800",height:"auto",fontFamily:'sdsds'}}  style={ CustomStyles }  >
          <h5 style={{paddingTop:2,paddingBottom:2,marginLeft:'2%',marginTop:'3%'}}>Approve Citizen</h5>
          <CardBody>

            <FormGroup>
              <Label htmlFor="company">Name</Label>
              <Input type="text" id="company" placeholder="The question to be entered" value={this.state.addQuestion}   onChange={this.addQuestionChange.bind(this)} />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="company">NIC</Label>
              <Input type="text" id="company" placeholder="The question to be entered" value={this.state.deleteQs}   onChange={this.addQuestionChange.bind(this)} />
            </FormGroup>
            <FormGroup>

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

              <Col xs="2" style={{marginLeft:'70.5%'}}>
                <Button type="submit" size="sm" color="primary" style={{width:200}} onClick={this.onEditQuestionOK.bind(this)}><i className="fa fa-dot-circle-o"></i> Approve</Button>
				
				
              </Col>
            </Row>

          </CardBody>

        </StyledModal>
		
		
        <Row>

        <Col xs="12" lg="12">
          <Card>
		  
            <CardHeader>
            
            </CardHeader>
			
			
			
            <CardBody>
            <BootstrapTable  height={String(Math.min([MAX_HEIGHT, (this.state.questionData.length + 1) * ROW_HEIGHT]))} data={this.state.questionData}    remote={ true }  options={options}  pagination  condensed fetchInfo={ { dataTotalSize: 1 }}    >

              <TableHeaderColumn   dataField="nic" isKey={true}  width="20%"  dataAlign="left"  >NIC</TableHeaderColumn>
              <TableHeaderColumn dataField="name" isKey={false}  width="30%"  dataAlign="left"   >Name</TableHeaderColumn>
              <TableHeaderColumn dataField="address" isKey={false}  width="50%"  dataAlign="left"   >Address</TableHeaderColumn>

                </BootstrapTable>

            </CardBody>

          </Card>
        </Col>

        </Row>

      </div>
    )
  }
}

export default Users;

