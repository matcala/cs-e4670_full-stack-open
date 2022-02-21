import React from "react"

const Weather = ({ place, weather }) => {

   console.log('city received from details: ', place);

   if (!weather.main) {
      console.log('No weather received from details: ', weather);
      return <></>
   }
   return (
      <>
         <h2>Weather in {place}</h2>
         <p><b>Temperature:</b> {weather.main.temp} Celcius</p>
         <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={`Weather icon for ${weather.weather[0].description}`}
            width="150" height="150" />
         <p><b>Wind:</b> {weather.wind.speed} m/s</p>
      </>
   )

}


export default Weather