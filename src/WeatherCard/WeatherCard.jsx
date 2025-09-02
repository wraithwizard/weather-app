import React, {useState, useEffect} from "react";
import classes from "./WheaterCard.module.css";

function WeatherCard({city}){
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        // change to env
        const API_KEY = "a834869cfaa5d7c779bada460caa16af";
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},mx&units=metric&appid=${API_KEY}&lang=es`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setWeather(data);            
            })
            .catch (err => console.log(err));
        }, [city]     
    );    

    if (!weather) return <div className={classes.CardStyle}>Cargando {city}...</div>;  

    // destruir useEffecT?

    return (
        <div className={classes.CardStyle}>
            <h2 className={classes.TitleStyle}>{city}</h2>
            <p>Temperatura: {weather?.main?.temp}°C</p>
            <p>Clima: {weather?.weather[0]?.description}</p>
            <p>Viento: {weather.wind.speed * 3.6.toFixed(0)} km/h</p>

                    <p>TESt</p>
                            <p>TESt2</p>

        </div>

    );
    
}

export default WeatherCard;