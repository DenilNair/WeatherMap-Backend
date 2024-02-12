
const fs= require('fs');
let existingData=[];

const callWeatherApi=(req) =>{
   
  
}


async function  loadDistrictList(req){
  console.log("call in loadDistrictList");
    //method to load all district wise temperature
   
      const districtWisetemp=await loadDistrictwiseTemperatureJson();
      //console.log("districtWisetemp ",districtWisetemp);
      return districtWisetemp;
    

}

const storeDistrictWiseTemp =(req)=>{
  //method to load all district
 //get all district 
(async () =>{
  try{
    const districtList=await loadDistrictJson();

  console.log("districtList-",districtList);
  callWeatherApiBasedonDistrictList(districtList);
}
catch (error) {
  console.error("There was a problem fetching data : ", error);
}
})();

}


async function loadDistrictJson(){
  try{
  let response= await fetch('https://raw.githubusercontent.com/DenilNair/WeatherMap/main/district_json.json');
  let data=await response.json();
    listofDistrict=data.states;
    console.log(listofDistrict);
    return listofDistrict;
  }catch(error){
    console.log('Error Fetching data ',error);
    throw error;
  }
  }

  async function loadDistrictwiseTemperatureJson(){
    try{
      let response=JSON.parse(fs.readFileSync('distrinctWiseTemp.json'));
      const listofDistrictwiseTemp=response;
      //console.log(listofDistrictwiseTemp);
      return listofDistrictwiseTemp;
    }catch(error){
      console.log('Error Fetching data ',error);
      throw error;
    }
    }


  function callWeatherApiBasedonDistrictList(listofDistrict) {
    var temp = "";
    var location = "";
    var tempColor="";
        try{
          existingData=JSON.parse(fs.readFileSync('distrinctWiseTemp.json'));
          console.log("existingData ",existingData);
        }    
        catch(err){
          console.error("Error reading file")
        }
    for(i=0;i<5;i++){
      var districtname=listofDistrict[i];
     (async () => {
                try {
                  const responsePromise =  apiCall(districtname);
                  responsePromise
                    .then((responseData) => {
                      temp = responseData.current.temp_c;
                      location = responseData.location.name;
                      

                      if(temp<-10){}
                      else if(temp>=-10 && temp<=-5){
                        tempColor="#002b03";
                      }
                      else if(temp>=-5 && temp<=0){
                        tempColor="#25a8fa";
                      }
                      else if(temp>=0 && temp<=5){
                        tempColor="#47b7fc";
                      }
                      else if(temp>=5 && temp<=10){
                        tempColor="#87d1ff";
                      }
                      else if(temp>=10 && temp<=15){
                        tempColor="#9fd9fc";
                      }
                      else if(temp>=15 && temp<=20){
                        tempColor="#c4e9ff";
                      }
                      else if(temp>=20 && temp<=25){
                        tempColor="#fcdea9";
                      }
                      else if(temp>=25 && temp<=30){
                        tempColor="#fcc59a";
                      }
                      else if(temp>=30 && temp<=35){
                        tempColor="#ff875e";
                      }
                      else if(temp>=35 && temp<=40){
                        tempColor="#5c0101";
                      }
                      else if(temp>=40 && temp<=45){
                        tempColor="#fa6555";
                      }
                      else if(temp>=45 && temp<=50){
                        tempColor="#fa3620";
                      }
                      
                      const newData={"Temperature":temp,"Location":location,"tempcolor":tempColor};
                      existingData.push(newData);

                      fs.writeFile('distrinctWiseTemp.json',JSON.stringify(existingData,null,2),'utf-8',err=>{
                        if(err){
                          console.error("Error writing to file: ",err);
                        }
                        else{
                          console.log('data has been written');
                        }
                      })
                     console.log("api response : Temp: ",temp," Location :",location);
                    })
                    .catch((error) => {
                      console.error("There was a problem fetching data ", error);
                    });
                } catch (error) {
                  console.error("There was a problem fetching data : ", error);
                }
              })();
            }
    
  }


   
//weather api
async function apiCall(place) {
  const url = "http://api.weatherapi.com/v1/current.json";

  const body = {};
  const apiKey = "1d5279c0e48c4dd4a4e101603241002";

  const queryParams = {
    key: apiKey,
    q: place,
  };

  const queryString = Object.keys(queryParams)
    .map(
      (key) =>
        encodeURIComponent(key) +
        "=" +
        encodeURIComponent(queryParams[key])
    )
    .join("&");
  console.log(queryString);
  const apiUrl = url + "?" + queryString;

  const fetchOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  console.log(apiUrl);
  return fetch(apiUrl, fetchOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network not responsding");
      }
      //console.log("response json",response.json())
      return response.json();
    })
    .catch((error) => {
      console.error("Error occurred ", error);
    });
}

module.exports={
    callWeatherApi,
    loadDistrictList,
    storeDistrictWiseTemp
};