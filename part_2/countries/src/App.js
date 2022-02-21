import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Results from './components/Results'

function App() {

   const [filter, setFilter] = useState("")
   const [countries, setCountries] = useState([])

   // only search through the list if filter is specified
   const countriesToShow = filter === ""
      ? []
      : countries.filter(country => country.name.toUpperCase().includes(filter.toUpperCase()))

   // fetch list of all countries from API
   useEffect(() => {
      const endpoint = 'https://restcountries.com/v2/all'
      axios
         .get(endpoint)
         .then((reponse) => {
            setCountries(reponse.data)
         })
   }, [])

   const updateFilter = (event) => setFilter(event.target.value)
   const handleShowClick = (country) => setFilter(country.name)

   return (
      <>
         <div>
            Find countries <input value={filter} onChange={updateFilter} />
         </div>
         <div>
            <Results countries={countriesToShow} handleClick={handleShowClick} />
         </div>
      </>
   )
}

export default App;