const express = require('express');
const {callWeatherApi,loadDistrictList,storeDistrictWiseTemp}= require('./service')

const app= express();
const PORT = 3000;

app.get('/api/hello',(req,res)=>{
    res.json({message: 'Hello from my API'});
});
app.get('/api/getWeather',(req,res)=>{
    callWeatherApi(req);
    res.json({message: 'Getting weather'});
});

app.get('/api/getDistrictListJson',async(req,res)=>{
 
        const response=await loadDistrictList(req);
        if(response===null){
            throw new Error('Failed to read data');
        }
        const jsonData=await response;
    console.log("final response",response);
    res.json(jsonData);
      
    
});

app.post('/api/updatemaptemperature',(req,res)=>{
    storeDistrictWiseTemp(req);
    res.json({message: 'update map temp'});
});
app.listen(PORT,()=>{
    console.log(`Server is listening to port : ${PORT}`);
});