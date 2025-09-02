import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import WeatherCard from "./WeatherCard/WeatherCard.jsx";


function App() {
  // mis puertos favoritos
  const ports = ["Celestun", "Chelem", "Progreso", "Chicxulub", "Telchac"];

  return ( 
      <div className="appStyle">
        <h1 className="titleStyle">Climas en Puertos Yucatecos</h1>
        <div className="gridStyle">
          {ports.map(( port) => (
            <WeatherCard key={port} city={port}/>
          ))}
        </div>
      </div>     
  )
}

export default App;
