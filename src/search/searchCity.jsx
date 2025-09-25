import React, { useState, useEffect } from 'react';

// Hook para buscar datos de una ciudad específica
const useSearchCity = () => {
  const [cityData, setCityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchCity = async (cityName) => {
    if (!cityName.trim()) return;
    
    setLoading(true);
    setError(null);
    setCityData(null);

    const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API;    
    
    try {
      //console.log(`🔍 Buscando ${cityName}...`);
      
      // 1️⃣ Obtener datos básicos del clima
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName},mx&units=metric&appid=${API_KEY}&lang=es`
      );
      
      if (!weatherRes.ok) {
        throw new Error(`Ciudad "${cityName}" no encontrada`);
      }
      
      const weatherData = await weatherRes.json();
      const { lat, lon } = weatherData.coord;

      // 2️⃣ Obtener probabilidad de lluvia
      const rainRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=precipitation_probability&forecast_days=1&timezone=auto`
      );
      
      let maxRain = 0;
      let maxRainHour = null;
      
      if (rainRes.ok) {
        const rainData = await rainRes.json();
        const probs = rainData.hourly?.precipitation_probability || [];
        const times = rainData.hourly?.time || [];
        
        let maxRainIndex = -1;
        probs.forEach((prob, index) => {
          if (prob > maxRain) {
            maxRain = prob;
            maxRainIndex = index;
          }
        });
        
        if (maxRainIndex >= 0 && times[maxRainIndex]) {
          const fullDateTime = new Date(times[maxRainIndex]);
          maxRainHour = fullDateTime.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
        }
      }

      // 3️⃣ Combinar toda la información
      const completeData = {
        name: weatherData.name,
        temp: weatherData.main?.temp,
        description: weatherData.weather[0]?.description,
        windSpeed: weatherData.wind?.speed,
        icon: weatherData.weather[0]?.icon,
        rainProb: maxRain,
        maxHour: maxRainHour,
        country: weatherData.sys?.country || 'MX'
      };
      
      setCityData(completeData);
      console.log(`✅ ${cityName} encontrada:`, completeData);
      
    } catch (err) {
      console.error('❌ Error buscando ciudad:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { cityData, loading, error, searchCity };
};

// Componente Modal
const CityModal = ({ isOpen, onClose, cityData, loading, error }) => {
  if (!isOpen) return null;

  const iconUrl = cityData?.icon 
    ? `https://openweathermap.org/img/wn/${cityData.icon}@4x.png`
    : null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'linear-gradient(#008E97, #087a83ff)',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '400px',
        width: '90%',
        color: 'white',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        position: 'relative',
        textAlign: 'center',
        borderColor: 'white',
        borderStyle: 'solid',
        borderWidth: '0.1rem'
      }}>
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '20px',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>

        {loading && (
          <div>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔍</div>
            <p>Buscando ciudad...</p>
          </div>
        )}

        {error && (
          <div>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>❌</div>
            <p style={{ color: '#ffcccb' }}>{error}</p>
          </div>
        )}

        {cityData && (
          <div>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '28px' }}>
              {cityData.name}
            </h2>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '20px',
              marginBottom: '20px'
            }}>
              {iconUrl && (
                <img 
                  src={iconUrl} 
                  alt={cityData.description}
                  style={{ width: '80px', height: '80px' }}
                />
              )}
              <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
                {cityData.temp?.toFixed(0)}°C
              </div>
            </div>

            <p style={{ 
              fontSize: '18px', 
              marginBottom: '15px',
              textTransform: 'capitalize'
            }}>
              {cityData.description}
            </p>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr',
              gap: '15px',
              marginTop: '20px'
            }}>
              <div style={{ 
                background: 'rgba(255,255,255,0.1)', 
                padding: '10px', 
                borderRadius: '10px' 
              }}>
                <div>💨 Viento</div>
                <div>{(cityData.windSpeed * 3.6).toFixed(0)} km/h</div>
              </div>
              
              <div style={{ 
                background: 'rgba(255,255,255,0.1)', 
                padding: '10px', 
                borderRadius: '10px' 
              }}>
                <div>🌧️ Lluvia</div>
                <div>{cityData.rainProb}%</div>
              </div>
            </div>

            {cityData.maxHour && cityData.rainProb > 0 && (
              <div style={{ 
                background: 'rgba(255,255,255,0.1)', 
                padding: '15px', 
                borderRadius: '10px',
                marginTop: '15px'
              }}>
                <div>⏰ Máxima lluvia: {cityData.maxHour}</div>
              </div>
            )}

            <div style={{ 
              marginTop: '20px',
              padding: '10px',
              background: cityData.rainProb > 50 
                ? 'rgba(255,193,7,0.3)' 
                : 'rgba(40,167,69,0.3)',
              borderRadius: '10px'
            }}>
              {cityData.rainProb > 50 
                ? `⚠️ Posible lluvia${cityData.maxHour ? ` a las ${cityData.maxHour}` : ''}`
                : '☀️ Día despejado'
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente principal de búsqueda
const CitySearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { cityData, loading, error, searchCity } = useSearchCity();

  const handleSearch = (e) => {
    if (searchTerm.trim()) {
      setIsModalOpen(true);
      searchCity(searchTerm);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSearchTerm('');
  };

  return (
    <div>
      {/* Barra de búsqueda */}
      <div style={{ 
        display: 'flex', 
        gap: '10px',
        marginBottom: '20px',
        justifyContent: 'center',
        marginTop: "2.5rem"
      }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar otra ciudad..."
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
          style={{
            padding: '12px 20px',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '25px',
            width: '300px',
            outline: 'none',
            transition: 'border-color 0.3s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
        <button
          onClick={handleSearch}
          disabled={!searchTerm.trim()}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: searchTerm.trim() 
              ? 'linear-gradient(#f27a11, #FC4C02)'
              : '#f27a11',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: searchTerm.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s'
          }}
        >
          🔍 Buscar
        </button>
      </div>

      {/* Modal */}
      <CityModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        cityData={cityData}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default CitySearch;