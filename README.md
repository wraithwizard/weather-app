🌊 **Climas en Puertos Yucatecos**
Una aplicación web moderna que muestra información meteorológica en tiempo real de los principales puertos de Yucatán, México. Desarrollada con React y diseñada específicamente para turistas y locales que planean actividades costeras.

🚀 **Características**
📍 5 Puertos Principales: Celestún, Chelem, Progreso, Chicxulub y Telchac
🌡️ Datos en Tiempo Real: Temperatura, descripción del clima y velocidad del viento
🌧️ Predicción de Lluvia: Probabilidad máxima de lluvia con hora específica
🔍 Búsqueda Personalizada: Busca cualquier ciudad de México con modal interactivo
📱 Diseño Responsivo: Optimizado para móviles, tablets y desktop
⚡ Performance Optimizada: Cache inteligente y peticiones en paralelo
🎨 UI Moderna: Iconos del clima y gradientes atractivos

🛠️ **Tecnologías Utilizadas**
Frontend: React 18 + Hooks (useState, useEffect, useMemo)
Styling: CSS Modules + Flexbox/Grid
APIs:
  OpenWeatherMap - Datos básicos del clima
  Open-Meteo - Predicciones de lluvia por horas  
Build Tool: Vite
Deployment: Netlify

🎯 **Características Técnicas**
Performance
Cache inteligente: 10 minutos para evitar llamadas repetidas al API
Peticiones paralelas: Todas las ciudades se procesan simultáneamente
Debounce: En el buscador para evitar spam de peticiones

UX/UI
Loading states: Indicadores de carga mientras se obtienen datos
Error handling: Manejo graceful de errores del API
Accesibilidad: Textos alternativos y contraste adecuado

Datos Mostrados
Temperatura: En Celsius, sin decimales
Descripción: Clima actual en español
Viento: Velocidad convertida a km/h
Lluvia: Probabilidad máxima con hora específica
Recomendaciones: Consejos basados en probabilidad de lluvia

🌊 **¿Por qué Puertos Yucatecos?**
Yucatán tiene una hermosa costa con puertos pesqueros y turísticos únicos. Esta aplicación ayuda a:
Turistas: Planificar actividades costeras
Pescadores: Decidir los mejores momentos para salir
Locales: Conocer condiciones para actividades al aire libre
