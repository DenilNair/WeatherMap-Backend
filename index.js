const express = require('express');
const {callWeatherApi,loadDistrictList}= require('./service')

const app= express();
const PORT = 3000;

app.get('/api/hello',(req,res)=>{
    res.json({message: 'Hello from my API'});
});
app.get('/api/getWeather',(req,res)=>{
    callWeatherApi(req);
    res.json({message: 'Getting weather'});
});

app.get('/api/getDistrictListJson',(req,res)=>{
    loadDistrictList(req);
    res.json({message: 'Getting District List'});
});

app.post('/api/updatemaptemperature',(req,res)=>{
    loadDistrictList(req);
    res.json({message: 'update map temp'});
});
app.listen(PORT,()=>{
    console.log(`Server is listening to port : ${PORT}`);
});