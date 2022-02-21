import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Weather from './CountryWeather'

const CountryDetails = ({ country }) => {

   const [weather, setWeather] = useState({})
   const weatherApiKey = process.env.REACT_APP_API_KEY

   useEffect(() => {
      console.log('country details: ', country);
      const endpoint = `http://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${weatherApiKey}&units=metric`
      axios
         .get(endpoint)
         .then((response) => {
            console.log('Response from weather API: ', response.data)
            setWeather(response.data)
         })
   }, [])

   return (
      <>
         <h1>{country.name}</h1>
         <p>Capital {country.capital}</p>
         <p>Population {country.population}</p>
         <h2>Languages</h2>
         <ul>
            {country.languages.map((language) => <li key={language.name}>{language.name}</li>)}
         </ul>
         <img src={country.flag} alt="Country flag" width="200"/>
         <Weather place={country.capital} weather={weather} />
      </>
   )

}

export default CountryDetails;