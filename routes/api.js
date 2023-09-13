const http = require('http');
const express = require('express');
const router = express.Router();
const userController = require('../controllers/UsersController');
const weatherController = require('../controllers/WeatherController');
const jwtmidleware = require('../midelware/jwt');

// routas para a api
router.post('/', userController.Register) // registar um utilizador;
router.get('/', userController.Login); // login de um utilizador;
router.put('/', jwtmidleware.verifyToken,userController.UpdateFavCities); // atualizar as cidades favoritas de um utilizador;
router.get('/weather', jwtmidleware.verifyToken,weatherController.GetCurrentWeatherCity); // obter a lista de cidades e o tempo atual de cada uma;
router.get('/weather/history', jwtmidleware.verifyToken,weatherController.GetWeatherCity); // obter historico do tempo de uma cidade;
module.exports = router;