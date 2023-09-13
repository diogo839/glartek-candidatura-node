const express = require('express');
const mongose = require('mongoose');
const city = require('./models/city');
const weatherController = require('./controllers/WeatherController');
const dotenv= require('dotenv')
const bodyParser = require('body-parser')
const AppError=require('./utils');
const DefaultCitys = require('./Data/citys.json')
dotenv.config('.env')


const app= express()
const host= process.env.HOST
const port =process.env.PORT
const DBParam=process.env.DATABASE
const cors= require('cors')
const router = require('./routes/api.js');



app.set("port", port || 80);
app.use(express.json());

app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: "*",
    preflightContinue: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", router);

app.all("*", (req, res, next) => {
  next(new AppError(`Url Unknown: ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

mongose.connect(DBParam, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("DB conected");
    console.log(host + " : " + app.get("port"));
    DefaultCitys.forEach(NewCity=>{
        // adiciona a lista das cidades default a partir do ficheiro citys.json
       city.findOne({CityId:NewCity.CityId},(err,cityFind)=>{
            if(!cityFind){
                city.create(NewCity)
            }
        })

    })
      // inicializa o metodo que ira atualizar a base de dados com a informação do tempo de cada cidade de 30 em 30 minutos
     weatherController.UpdateWeather().then(()=>{
         setInterval(weatherController.UpdateWeather, 1800000);
     });
  });







app.listen(port, host, () => {
  console.log("Server Start...");
});