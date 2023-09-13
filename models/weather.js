const mongoose= require('mongoose');

const sysType= new mongoose.Schema({
    pod:{
        type: String
    }
})

const cloudsType= new mongoose.Schema({
    all:{
        type: Number
    }
})

const windType= new mongoose.Schema({
    speed:{
        type: Number
    },
    deg:{
        type: Number
    },
    gust:{
        type: Number
    }
});

const mainType= new mongoose.Schema({
    temp:{
        type: Number
    },
    feels_like:{
        type: Number
    },
    temp_min:{
        type: Number
    },
    temp_max:{
        type: Number
    },
    pressure:{
        type: Number
    },
    humidity:{
        type: Number
    },
    sea_level:{
        type: Number
    },
    grnd_level:{
        type: Number
    },
    temp_kf:{
        type: Number
    },
})


const WeatherType= new mongoose.Schema({
    id:{
        type: Number
    },
    main:{
        type: String
    },
    description:{
        type: String
    },
    icon:{
        type: String
    }
})

const WeatherSchema= new mongoose.Schema({
    weather:{
        type: [WeatherType]
    },
    main: {
        type: mainType
    },
    wind:{
        type: windType
    },
    clouds:{
        type: cloudsType
    },
    dt:{
        type: Number
    },
    sys:{
        type: sysType
    },
    timezone:{
        type: Number
    },
    dt_txt:{
        type: String
    },
    visibility:{
        type: Number
    },
    pop:{
        type: Number
    },
    cityId:{
        type: String
    }
})

const weather= mongoose.model('weather', WeatherSchema);

module.exports= weather