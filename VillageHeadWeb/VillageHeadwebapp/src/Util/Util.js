exports.getenv = function(envName, defVal){

  var envVal = process.env[envName];
  if(envVal!=undefined)
    return envVal;
  else
    return defVal;
    //return '13.229.206.252'
}


exports.getFormattedTime = function(timeinmiliseconds){
  var date=new Date();


  if(timeinmiliseconds == ''){

      return ""
  }

  date.setTime(timeinmiliseconds);

  var year = date.getFullYear(),
    month = (date.getMonth() + 1).toString(),
     formatedMonth = (month.length === 1) ? ("0" + month) : month,
     day = date.getDate().toString(),
    formatedDay = (day.length === 1) ? ("0" + day) : day,
     hour = date.getHours().toString(),
    formatedHour = (hour.length === 1) ? ("0" + hour) : hour,
    minute = date.getMinutes().toString(),
    formatedMinute = (minute.length === 1) ? ("0" + minute) : minute,
    second = date.getSeconds().toString(),
    formatedSecond = (second.length === 1) ? ("0" + second) : second;
 return year + "-" + formatedMonth + "-" + formatedDay  + " " + formatedHour + ':' + formatedMinute + ':' + formatedSecond;

}

exports.getTimeInterval=function(date,view){

  var date = new Date(date)
  console.log("Recived Date -- >>>"+date);
  //date.setDay(0)
    console.log("New Date -- >>>"+view);

  var startDate=new Date()
  var endDate= new Date()

  //alert(date+" View "+view)
  if(view=="month"){

    startDate.setYear(date.getFullYear())
    startDate.setMonth(date.getMonth())
    startDate.setDate(1)

    endDate.setYear(date.getFullYear())
    endDate.setMonth(date.getMonth())

    console.log("Month >>>"+endDate.getMonth());
    if(startDate.getMonth()==0 ||  startDate.getMonth()==2 ||  startDate.getMonth()==4 ||  startDate.getMonth()==6  ||  startDate.getMonth()==7  ||  startDate.getMonth()==9 ){

      endDate.setDate(31)


    }else if(startDate.getMonth()==3 ||  startDate.getMonth()==5 ||  startDate.getMonth()==8 ||  startDate.getMonth()==10  ||  startDate.getMonth()==10  ||  startDate.getMonth()==11 ){
       endDate.setDate(30)

    }else if(startDate.getMonth()==1){

      if((startDate.getYear()%4)==0){
        endDate.setDate(29)

      }else{

        endDate.setDate(28)

      }
    }

    console.log("End date ---Final >"+endDate);

     return startDate.getTime()+"|"+endDate.getTime()
  }

  if(view=="week"){





      while(date.getDay()!=0){
        date.setDate(date.getDate()-1);
     }
      var endDD=new Date();
      endDD.setTime(date.getTime())

      endDD.setDate(date.getDate()+6);



     console.log("Start date>"+date+"   End date >"+endDD);
     return date.getTime()+"|"+endDD.getTime()

    }


    if(view=="day"){

      var endDD=new Date();



      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);


      endDD.setTime(date.getTime())
      endDD.setHours(24);

      console.log("Day ----->>"+date);
       //
       //  while(date.getDay()!=0){
       //    date.setDate(date.getDate()-1);
       // }
       //  var endDD=new Date();
       //  endDD.setTime(date.getTime())
       //
       //  endDD.setDate(date.getDate()+6);



       return date.getTime()+"|"+endDD.getTime()

      }


 return date.getTime()+"|"+endDate.getTime()
}

exports.getMonthStart=function(){


  var startDate=new Date()




    startDate.setDate(1)


     return startDate.getTime()


 }
 exports.getDateLabel=function(timestamp){


   var startDate=new Date()

   startDate.setTime(timestamp)
   var dateString='';
   // if(startDate.getDate()<=7){
   //   dateString=startDate.getDate()
   // }

   console.log("STARTDATE  "+startDate);

      return startDate.getDate()


  }

  exports.getDateArrayInit=function(){


    var startDate=new Date()
    var dateArray=[]

    if(startDate.getMonth()==0 ||  startDate.getMonth()==2 ||  startDate.getMonth()==4 ||  startDate.getMonth()==6  ||  startDate.getMonth()==8  ||  startDate.getMonth()==10 ){

      dateArray=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,31]

    }else if(startDate.getMonth()==3 ||  startDate.getMonth()==5 ||  startDate.getMonth()==7 ||  startDate.getMonth()==9  ||  startDate.getMonth()==11  ||  startDate.getMonth()==10 ){
      dateArray=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]


    }else if(startDate.getMonth()==1){

      if((startDate.getYear()%4)==0){

        dateArray=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29]


      }else{
        dateArray=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]


      }
    }
       return dateArray


   }

   exports.getDateArrayInit=function(){


     var startDate=new Date()
     var dateArray=[]

     if(startDate.getMonth()==0 ||  startDate.getMonth()==2 ||  startDate.getMonth()==4 ||  startDate.getMonth()==6  ||  startDate.getMonth()==8  ||  startDate.getMonth()==10 ){

       dateArray=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,31]

     }else if(startDate.getMonth()==3 ||  startDate.getMonth()==5 ||  startDate.getMonth()==7 ||  startDate.getMonth()==9  ||  startDate.getMonth()==11  ||  startDate.getMonth()==10 ){
       dateArray=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]


     }else if(startDate.getMonth()==1){

       if((startDate.getYear()%4)==0){

         dateArray=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29]


       }else{
         dateArray=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]


       }
     }
        return dateArray


    }
    exports.getStartToday=function(){
        var startDate=new Date()
        startDate.setDate(1);

        return startDate.getTime().toString().substring(0,10)

     }

    exports.getEndToday=function(){
      var startDate=new Date()

      if(startDate.getMonth()==0 ||  startDate.getMonth()==2 ||  startDate.getMonth()==4 ||  startDate.getMonth()==6  ||  startDate.getMonth()==8  ||  startDate.getMonth()==10 ){

        startDate.setDate(31)


      }else if(startDate.getMonth()==3 ||  startDate.getMonth()==5 ||  startDate.getMonth()==7 ||  startDate.getMonth()==9  ||  startDate.getMonth()==11  ||  startDate.getMonth()==10 ){


      }else if(startDate.getMonth()==1){

        if((startDate.getYear()%4)==0){
          startDate.setDate(29)

        }else{

          startDate.setDate(28)

        }
      }
      return startDate.getTime().toString().substring(0,10)

    }
    exports.getDateArrayDemand=function(startDate){


       var dateArray=[]

      if(startDate.getMonth()==0 ||  startDate.getMonth()==2 ||  startDate.getMonth()==4 ||  startDate.getMonth()==6  ||  startDate.getMonth()==7  ||  startDate.getMonth()==9 ||  startDate.getMonth()==11 ){

        dateArray=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,31]

      }else if(startDate.getMonth()==3 ||  startDate.getMonth()==5 ||  startDate.getMonth()==7 ||  startDate.getMonth()==8  ||  startDate.getMonth()==10 ){
        dateArray=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]


      }else if(startDate.getMonth()==1){

        if((startDate.getYear()%4)==0){

          dateArray=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29]


        }else{
          dateArray=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]

        }
      }
         return dateArray


     }
