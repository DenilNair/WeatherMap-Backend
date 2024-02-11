const callWeatherApi=(req) =>{
    
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
  
}


const loadDistrictList =(req)=>{
    //method to load all district
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
}

module.exports={
    callWeatherApi,
    loadDistrictList
};