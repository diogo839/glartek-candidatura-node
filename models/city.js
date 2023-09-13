const mongoose= require('mongoose');


const CitySchema= new mongoose.Schema({
    CityId:{
        type: String,
        unique: true
    },
    Name:{
        type: String
    },
    Sunrise:{
        type: String
    },
    Sunset:{
        type: String
    }
})


module.exports= mongoose.model('city', CitySchema);