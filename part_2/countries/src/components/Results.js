import React from 'react'
import CountryDetails from './CountryDetails'
import Button from './Button'


const Results = ({ countries, handleClick }) => {

   if (countries.length === 0) {
      return <></>
   }
   else if (countries.length === 1) {
      return <CountryDetails country={countries[0]} />
   }
   else if (countries.length > 10) {
      return <p>Too many results, be more specific!</p>
   }
   else {
      return (
         <ul>
            {countries.map(country => <li key={country.name}>{country.name} <Button name="show" handleClick={() => handleClick(country)} /></li>)}
         </ul>
      )
   }
}

export default Results;