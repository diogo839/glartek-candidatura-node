const mongoose= require('mongoose');

const UserSchema= new mongoose.Schema({
    Name:{
        type: String,
    },
    Email:{
        type: String,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: props => `O email não é valido!`
        },

    },
    Password:{
        type: String,
    },
    FavCities:{
        type: [String]
    }

});


module.exports= mongoose.model('user', UserSchema);