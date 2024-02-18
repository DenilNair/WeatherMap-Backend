const { response } = require("express");
const fs = require("fs");
let existingData = [];
const districtWiseFilePath= path.join(process.cwd(),"dist/distrinctWiseTemp.json");
    

const callWeatherApi = (req) => { };

async function loadDistrictList(req) {
  //console.log("call in loadDistrictList");
  //method to load all district wise temperature

  const districtWisetemp = await loadDistrictwiseTemperatureJson();
  ////console.log("districtWisetemp ",districtWisetemp);
  return districtWisetemp;
}

const storeDistrictWiseTemp = (req) => {
  //method to load all district
  //get all district
  (async () => {
    try {
      const districtList = await loadDistrictJson();

      ////console.log("districtList-",districtList);
      callWeatherApiBasedonDistrictList(districtList);
    } catch (error) {
      //console.error("There was a problem fetching data : ", error);
    }
  })();
};

const updateDistrictTemperature = (req) => {
  //method to load all district
  //get all district
  (async () => {
    try {
      //console.log("request ",req.body);
      const districtWisetemp = await loadDistrictwiseTemperatureJson();
      var colourCode=getColorCodeBasedOnTemp(req.body.temp);
      ////console.log("districtWisetemp ",districtWisetemp);
      updateTemperatureOfParticularDistrict(
        districtWisetemp,
        req.body.temp,
        req.body.district,colourCode
      );

      ////console.log("districtList-",districtList);
      //callWeatherApiBasedonDistrictList(districtList);
    } catch (error) {
      //console.error("There was a problem fetching data : ", error);
    }
  })();
};

async function loadDistrictJson() {
  try {
    let districtList = JSON.parse(fs.readFileSync("district_json.json"));
   

      listofDistrict = districtList.states;
    //console.log(listofDistrict);
    return listofDistrict;
    
    //let data=await response.json();
    
  } catch (error) {
    //console.log('Error Fetching data ',error);
    throw error;
  }
}

async function loadDistrictwiseTemperatureJson() {
  try {
    let response = JSON.parse(fs.readFileSync(districtWiseFilePath));
    const listofDistrictwiseTemp = response;
    ////console.log(listofDistrictwiseTemp);
    return listofDistrictwiseTemp;
  } catch (error) {
    //console.log('Error Fetching data ',error);
    throw error;
  }
}

async function updateDistrictwiseTemperatureJson(
  listofDistrictwiseTemp,
  temp,
  district,
  colourCode
) {
  try {
    ////console.log(listofDistrictwiseTemp);
    for (i = 0; i < listofDistrictwiseTemp.length; i++) {
      let arrayTemp = listofDistrictwiseTemp[i].Location;
      ////console.log("arrayTemp ",arrayTemp,district);
      if (
        arrayTemp.toString().toUpperCase() == district.toString().toUpperCase()
      ) {
        listofDistrictwiseTemp[i].Temperature = parseInt(temp);
        listofDistrictwiseTemp[i].tempColor = colourCode;
      }
    }
    //console.log();
    fs.writeFileSync(
      districtWiseFilePath,
      JSON.stringify(listofDistrictwiseTemp),
      (err) => {
        if (err) {
          ////console.error('Error while writing to a file: ',err);
        }
        ////console.log('data written successful');
      }
    );

    return "updatedListofDistrictwiseTemp";
  } catch (error) {
    //console.log('Error Fetching data ',error);
    throw error;
  }
}

async function updateTemperatureOfParticularDistrict(
  listofDistrictwiseTemp,
  temp,
  district,colourCode
) {
  try {
    //console.log("temp ", temp, "district ", district);
    var districtExistinList = false;
    //console.log("arrayTemp ", listofDistrictwiseTemp);
    for (i = 0; i < listofDistrictwiseTemp.length; i++) {
      let arrayTemp = listofDistrictwiseTemp[i].Location;
      
      if (
        arrayTemp.toString().toUpperCase() == district.toString().toUpperCase()
      ) {
        districtExistinList = true;
        listofDistrictwiseTemp[i].Temperature = parseInt(temp);
        listofDistrictwiseTemp[i].tempColor = colourCode;
      }
    }
    if (!districtExistinList) {
      listofDistrictwiseTemp.push({Temperature:parseInt(temp),Location:district.toString(),tempcolor:colourCode});
     
    }
    //console.log();
    fs.writeFileSync(
      "distrinctWiseTemp.json",
      JSON.stringify(listofDistrictwiseTemp),
      (err) => {
        if (err) {
          ////console.error('Error while writing to a file: ',err);
        }
        ////console.log('data written successful');
      }
    );

    //remove the below code once we have all the correct district configured
    let responseDistrictData =  loadDistrictJson();
    
      console.log('loadDistrictJson', typeof responseDistrictData);
      var found = false;
      for (i = 0; i < responseDistrictData.length; i++) {
        if (responseDistrictData[i] == district) {
          found = true;
        }
      }
      if (!found) {
        console.log("adding to new district into list");
        responseDistrictData[responseDistrictData.length] = district;
        fs.writeFileSync(
          "district_json.json",
          JSON.stringify(responseDistrictData),
          (err) => {
            if (err) {
              //console.error('Error while writing to a file: ',err);
            }
            //console.log('data written successful');
          }
        );
      }
    

    return "updatedTemperatureOfParticularDistrict";
  } catch (error) {
    //console.log('Error Fetching data ',error);
    throw error;
  }
}

function callWeatherApiBasedonDistrictList(listofDistrict) {
  var temp = "";
  var location = "";
  var tempColor = "";
  /* try{
          existingData=JSON.parse(fs.readFileSync('distrinctWiseTemp.json'));
          //console.log("existingData ",existingData);
        }    
        catch(err){
          //console.error("Error reading file")
        }
        */
  //console.log('listofDistrict length ',listofDistrict.length);
  for (i = 0; i < listofDistrict.length; i++) {
    var districtname = listofDistrict[i];
    (async () => {
      try {
        //console.log("making a call to district ", districtname);
        const responsePromise = apiCall(districtname);
        responsePromise
          .then((responseData) => {
            temp = responseData.current.temp_c;
            location = responseData.location.name;

            tempColor=getColorCodeBasedOnTemp(temp);

            const newData = {
              Temperature: temp,
              Location: location,
              tempcolor: tempColor,
            };
            existingData.push(newData);

            fs.writeFile(
              "distrinctWiseTemp.json",
              JSON.stringify(existingData, null, 2),
              "utf-8",
              (err) => {
                if (err) {
                  // //console.error("Error writing to file: ",err);
                } else {
                  ////console.log('data has been written');
                }
              }
            );

            ////console.log("api response : Temp: ",temp," Location :",location);
          })
          .catch((error) => {
            //console.error("There was a problem fetching data ", error);
          });
      } catch (error) {
        //console.error("There was a problem fetching data : ", error);
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
        encodeURIComponent(key) + "=" + encodeURIComponent(queryParams[key])
    )
    .join("&");
  //console.log(queryString);
  const apiUrl = url + "?" + queryString;

  const fetchOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  //console.log(apiUrl);
  return fetch(apiUrl, fetchOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network not responsding");
      }
      ////console.log("response json",response.json())
      return response.json();
    })
    .catch((error) => {
      //console.error("Error occurred ", error);
    });
}

function getColorCodeBasedOnTemp(temp) {
  var tempColor;
  if (temp < -10) {
    tempColor = "#0318ff";
  } else if (temp >= -10 && temp <= -5) {
    tempColor = "#1452fc";
  } else if (temp >= -5 && temp <= 0) {
    tempColor = "#25a8fa";
  } else if (temp >= 0 && temp <= 5) {
    tempColor = "#47b7fc";
  } else if (temp >= 5 && temp <= 10) {
    tempColor = "#87d1ff";
  } else if (temp >= 10 && temp <= 15) {
    tempColor = "#9fd9fc";
  } else if (temp >= 15 && temp <= 20) {
    tempColor = "#c4e9ff";
  } else if (temp >= 20 && temp <= 25) {
    tempColor = "#fcdea9";
  } else if (temp >= 25 && temp <= 30) {
    tempColor = "#fcc59a";
  } else if (temp >= 30 && temp <= 35) {
    tempColor = "#ff875e";
  } else if (temp >= 35 && temp <= 40) {
    tempColor = "#5c0101";
  } else if (temp >= 40 && temp <= 45) {
    tempColor = "#fa6555";
  } else if (temp >= 45 && temp <= 50) {
    tempColor = "#fa3620";
  }
  return tempColor;
}

module.exports = {
  callWeatherApi,
  loadDistrictList,
  storeDistrictWiseTemp,
  updateDistrictTemperature,
};
