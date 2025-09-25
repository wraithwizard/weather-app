import './App.css'
import WeatherCard from "./WeatherCard/WeatherCard.jsx";
import WeatherComponent, { useRainProbabilities } from "./OpenMeteo/OpenMeteo.jsx";
import classes from "./WeatherCard/WeatherCard.module.css"
import beachImage from "./assets/beach.jpg"; // Importación directa
import CitySearch from './search/searchCity.jsx';


const ports = ["Celestun", "Chelem", "Progreso", "Chicxulub", "Telchac"];

function App() {
  const { rainData, loading } = useRainProbabilities(ports);

  if (loading){
    return <div> Cargando datos meteorológicos...</div>;
  }
  
  return (
    <div className="appStyle">     
      <h1 className="titleStyle">Climas en Puertos Yucatecos</h1>
      <div className="gridStyle">
        {ports.map((port) => (
          <WeatherCard
            key={port}
            city={port}
            // probability
            rainProb={rainData[port]?.rainProb}
            // hour
            maxHour = {rainData[port]?.maxHour}
          />
        ))}
      </div>
      {/* buscador */}
      <CitySearch/>
    </div>
  );
}

export default App;