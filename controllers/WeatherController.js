const weather = require('../models/weather');
const city = require('../models/city');
var axios = require('axios');
const jwt = require('jsonwebtoken');


/**
 * Metodo para atualizar a base de dados com a informação do tempo de cada cidade de 30 em 30 minutos
 * @returns {Promise<void>}
 * @constructor
 */
exports.UpdateWeather = async () => {

    const cities = await city.find({});
    try {

        for (const city1 of cities) {
            const configMetric = {
                method: 'get',
                url: `http://api.openweathermap.org/data/2.5/forecast?id=${city1.CityId}&APPID=${process.env.APIKEY}&units=metric&cnt=1&lang=PT`,
                headers: {}
            };

            axios(configMetric).then(function (response) {
                const res = response.data;
                let weatherData = res.list[0];
                let cityData = res.city;
                const currentdate = new Date();
                weatherData.cityId = city1.CityId;
                weatherData.dt_txt = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + "00";
                weatherData.dt = currentdate.getTime();
                weather.create(weatherData);
                city.findOne({CityId: city1.CityId}).then(function (response) {
                    response.Sunrise = cityData.sunrise;
                    response.Sunset = cityData.sunset;
                    response.save();
                });
            }).catch(function (error) {
                console.log(error);
            });
        }
    } catch (e) {
        console.log(e)

    }

}


/**
 * Metodo para obter a lista de cidades e o tempo atual de cada uma
 * @param headers - jwt token
 * @param res - response do servidor com a lista de cidades e o tempo atual de cada uma
 * @returns {Promise<void>}
 * @constructor
 */
exports.GetCurrentWeatherCity = async (req, res) => {

    try {
        const weatherCity = [];

        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }
        const cities = await city.find({});


        for (let i = 0; i < cities.length; i++) {
            let weatherMostRecent = await weather.findOne({cityId: cities[i].CityId}, {}, {sort: {'dt': -1}});
            weatherCity.push({
                CityId: cities[i].CityId,
                Name: cities[i].Name,
                Weather: weatherMostRecent.main.temp,
                icon: weatherMostRecent.weather[0].icon,
                description: weatherMostRecent.weather[0].description,
                sunrise: cities[i].Sunrise,
                sunset: cities[i].Sunset
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET).payload.user;
        token = jwt.sign({payload: {decoded}}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        res.status(200).json({
            status: "success",
            weatherCity,
            token
        });

    } catch (e) {
        console.log(e)
        res.status(500).json({e});
    }

}


/**
 * Metodo para obter o hisorico de tempo de uma cidade
 * @param req ( cityId - id da cidade)  query params
 * @param headers - jwt token
 * @param res - response do servidor com o historico de tempo da cidade
 * @returns {Promise<void>}
 * @constructor
 */
exports.GetWeatherCity = async (req, res) => {
    try {


        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }
        const {cityId} = req.query;
        const weatherData = await weather.find({cityId: cityId}, {}, {sort: {'dt': -1}});
        const decoded = jwt.verify(token, process.env.JWT_SECRET).payload.user;
        token = jwt.sign({payload: {decoded}}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        res.status(200).json({
            status: "success",
            weatherData,
            token
        });

    } catch (e) {
        console.log(e)
        res.status(500).json({e});
    }
}