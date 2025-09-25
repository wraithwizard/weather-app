import React, {useState, useEffect} from "react";
import classes from "./WeatherCard.module.css";

function WeatherCard({city, rainProb, maxHour}){
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API;
        
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},mx&units=metric&appid=${API_KEY}&lang=es`)
            .then(res => res.json())
            .then(data => {
                //console.log(data);
                setWeather(data);            
            })
            .catch (err => console.log(err));
        }, [city]     
    );    

    if (!weather) return <div className={classes.CardStyle}>Cargando {city}...</div>;  

    // destruir useEffecT?
    
    // icons url
    const iconCode = weather.weather[0]?.icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    return (
        <div className={classes.CardStyle}>
            <h2 className={classes.TitleStyle}>{city}</h2>
            <div className={classes.Division}>
                <div className={classes.WeatherDescription}>
                    {/* Aquí el ícono */}
                    <img src={iconUrl} alt={weather.weather[0]?.description} className={classes.IconStyle}/>
                    <p className={classes.TextStyle}>
                    {weather?.weather[0]?.description}
                    </p>
                </div>
                <p className={`${classes.TextStyle} ${classes.Temperature}`}>
                    {weather?.main?.temp.toFixed(0)} °C
                </p>
            </div>
         

            <div className={classes.Division}>
                <p className={classes.TextStyle}>
                    Viento: {(weather.wind.speed * 3.6).toFixed(0)} km/h
                </p>     
            </div> 

            <div className={classes.Division}>
                {rainProb !== undefined && 
                <p className={classes.TextStyle}>
                    Probabilidad de lluvia max.: {rainProb}% 
                    {maxHour && ` a las ${maxHour}`}
                </p>}   
            </div>
            {/* aqui poner la hora del dia donde la probabilidad de lluvia es top */}       
            <p className = {`${classes.TextStyle} ${classes.SmallText}`}>  
                {rainProb > 50 ? `Posible lluvia${maxHour ? ` a las: ${maxHour}` : ""}` : "No lloverá"}
            </p>
        </div>
    );    
}

export default WeatherCard;