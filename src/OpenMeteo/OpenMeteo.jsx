import { useMemo } from "react";
import { useState, useEffect, useRef } from "react";

// global cache to avoid duplicate calls
const globalCache = new Map();
// 10 minutes
const cacheDuration = 10 * 60 * 1000; 

// Esta función recibe un array de ciudades y devuelve { city, rainProb }
export const useRainProbabilities = (cities) => {
  const [rainData, setRainData] = useState({});
  const [loading, setLoading] = useState(true);
  const abortControllerRef =  useRef(null);

  // lets grab the array of cities in order to avoid unnecessary renders
  const stableCities = useMemo(() => {
    // is an array?
    if (!Array.isArray(cities)) return [];
    return [...cities].sort();
  }, [cities]);

  useEffect(() => {
    // cancels any previous petition
    if (abortControllerRef.current) abortControllerRef.current.abort();

    abortControllerRef.current =  new AbortController();
    const signal = abortControllerRef.current.signal;

    const fetchRainForCities = async () => {
      if (stableCities.length === 0){
        setRainData({});
        setLoading(false);
        return;
      }

      setLoading(true);
      const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API;

      const results = {};
      const now = Date.now();

      try {
        // process al cities
        const promises = stableCities.map(async(city) => {
        const cacheKey = `${city}_mx`;
        const cached = globalCache.get(cacheKey);
        // use cache if available and recent
        if (cached && (now - cached.timestamp) < cacheDuration){
          //console.log(`cache para ${city}`);
          return {city, rainProb: cached.data};
        }

        try{
            // 1️⃣ Obtener coords con OpenWeather
          const geoRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city},mx&appid=${API_KEY}`, {signal}
          );

          if (!geoRes.ok) throw new Error("Error geo para" +city);
          if (signal.aborted) return null;
          
          const geoData = await geoRes.json();
          const { lat, lon } = geoData.coord;   

          // 2️⃣ Obtener lluvia con Open-Meteo
          const url = "https://api.open-meteo.com/v1/forecast";
          const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            hourly: "precipitation_probability",
            forecast_days: 1,
            timezone: "auto",
          });

          const res = await fetch(`${url}?${params}`,{signal});

          if (!res.ok) throw new Error("Error Open-Meteo para: " +city);
          if (signal.aborted) return null;

          const data = await res.json();
          const probs = data.hourly?.precipitation_probability || [];
          // lets find out the hour of max rain prob
          const times = data.hourly?.time || [];
          let maxRain = 0;
          let maxRainHour = null;           // API docs says this must be a string
          let maxRainIndex = -1;

          if (probs.length > 0){
            probs.forEach((prob, index) => {
              if (prob > maxRain){
                maxRain = prob;
                maxRainIndex = index;
              }
            });
          }

          // get the hour
          if (maxRainIndex >= 0 && times[maxRainIndex]){
            const fullDateTime = new Date(times[maxRainIndex]);
            maxRainHour = fullDateTime.toLocaleTimeString("es-MX", {
              hour: "2-digit",
              minute: "2-digit", 
              hour12: false
            });
          }

          // save info
          const rainInfo = {
            rainProb: maxRain,          
            maxHour: maxRainHour,
            maxProb: maxRain,
            allProbs: probs,
            allTimes: times
          };
          
          // save on cache
          globalCache.set(cacheKey, {
            data: maxRain,
            timestamp: now
          });

          //console.log(`${city}: ${maxRain}% a las ${maxRainHour}`);
          return {city, rainData: rainInfo}; 
        } catch (e) {
          if (e.name === "AbortError") return null;
          console.error(`Error en ${city}:`, e);
          return {city, rainData: null};
        }
      });

        // wait to all cities finish
        const cityResults = await Promise.all(promises);
        if (signal.aborted) return;

        // turns into object
        cityResults.forEach(result => {
          if (result){
            results[result.city] = result.rainData;
          }
        });    
        
        setRainData(results);
      } catch(error) {
        if (error.name !== "AbortError"){
          console.error("error general:" +error);
        }
      } finally{
        if (!signal.aborted){
          setLoading(false);
        }
      }              
    };

    fetchRainForCities();
    // clean up
    return () => {
      if (abortControllerRef.current){
        abortControllerRef.current.abort();
      }
    };
  }, [stableCities]); //stable array
  return { rainData, loading }; 
};

export default function WeatherComponent({ ports }) {
  const { rainData, loading } = useRainProbabilities(ports);
  if (loading) return <p>Cargando probabilidad de lluvia…</p>;

  return (
    <div>
      {/* {Object.entries(rainData).map(([city, rainProb]) => (
        <div key={city}> */}
          {/* <strong>{city}:</strong> {rainProb !== null ? `${rainProb}%` : 'N/A'} */}
          {/* <strong>{city}:</strong> */}
          {/* {data ? (
            <>
              <span> {data.maxProb}% </span>
              {data.maxHour && <span>  a las {data.maxHour}</span>}
              </>
          ) : "N/A"} */}
        {/* </div> */}
      {/* ))} */}
    </div>
  );
}
