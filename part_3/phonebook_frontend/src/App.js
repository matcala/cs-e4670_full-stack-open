import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Form from './components/Form'
import Persons from './components/Persons'
import phonebookService from './services/phonebook'
import Notification from './components/Notification'


const App = () => {
   const [persons, setPersons] = useState([])
   const [newName, setNewName] = useState('')
   const [newNumber, setNewNumber] = useState('')
   const [newFilter, setFilterName] = useState('')
   const [notificationMessage, setNotificationMessage] = useState(null)
   const [isError, setIsError] = useState(false)

   // fetch list of all people and update state
   useEffect(() => {
      phonebookService.getAll()
         .then((personsList) => {
            setPersons(personsList)
         })
   }, [isError])
   // isError is passed to dependency array to update the people list (and rerender)
   // if an error during phonebook update occurs.

   // select person matching filter if filter is defined
   const personsToShow = newFilter === ''
      ? persons
      : persons.filter(person => person.name.toUpperCase().includes(newFilter.toUpperCase()))


   // add name to db
   const addPerson = (event) => {
      event.preventDefault()

      // only add if person is not present already 
      const target = persons.find((person) => person.name === newName)
      if (target === undefined) {
         const newPerson = {
            name: newName,
            number: newNumber
         }

         phonebookService.createPerson(newPerson)
            .then(result => {
               setPersons(persons.concat(result))
               setNotificationMessage(`${result.name} has been added to the phonebook`)
               // keep notification message for 4s
               setTimeout(() => setNotificationMessage(null), 4000)

            })
            //in case the API responds with an error
            .catch(error => {
               console.log("An error occured while adding the person: ", error)
               setNotificationMessage(error.response.data.error)
               setIsError(true)
               // keep error message for 4s
               setTimeout(() => {
                  setIsError(false)
                  setNotificationMessage(null)
               }, 4000)

            })
      } else {
         // if here, person is already present in db,
         // ask wheter to update
         const result = window.confirm(`${target.name} is already in the phonebook, update number with a new one?`)
         if (result) {
            const updatedPerson = { ...target, number: newNumber }
            phonebookService.updatePerson(updatedPerson)
               // person updated successfully 
               .then(returnedPerson => {
                  setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
                  setNotificationMessage(`The number for ${returnedPerson.name} has been updated`)
                  setTimeout(() => setNotificationMessage(null), 4000)
               })
               .catch(error => {
                  if (error.response.status === 404) {
                     setIsError(true)
                     setNotificationMessage(`${newName} has already been removed from the phonebook`)
                     // debugger
                     setTimeout(() => {
                        setNotificationMessage(null)
                        setIsError(false)
                     }, 4000)
                  } else if (error.response.status === 400) {
                     setIsError(true)
                     setNotificationMessage(error.response.data.error)
                     setTimeout(() => {
                        setNotificationMessage(null)
                        setIsError(false)
                     }, 4000)
                  } else {
                     setIsError(true)
                     setNotificationMessage(`Something went wrong while updating entry ${updatedPerson}`)
                     setTimeout(() => {
                        setNotificationMessage(null)
                        setIsError(false)
                     }, 4000)
                     console.log(`Something went wrong while updating entry ${updatedPerson}`);
                  }
               })
         }
      }
      // flush form after calls 
      setNewName('')
      setNewNumber('')
   }

   const deletePerson = toBeDeleted => {
      phonebookService.deletePerson(toBeDeleted.id)
         .then(returnedPerson => {
            const result = window.confirm(`Delete ${persons.find(person => person.id === toBeDeleted.id).name}?`)
            if (result)
               setPersons(persons.filter(person => person.id !== toBeDeleted.id))
         })
         .catch(error => {
            alert(`Something went wrong while deleting ${toBeDeleted.name}`)
         })
   }

   const handleNameUpdate = (event) => setNewName(event.target.value)
   const handleNumberUpdate = (event) => setNewNumber(event.target.value)
   const handleFilterUpdate = (event) => setFilterName(event.target.value)

   return (
      <>
         <h2>Phonebook</h2>
         <Notification message={notificationMessage} isError={isError} />
         <Filter handleFilterChange={handleFilterUpdate} filterName={newFilter} />
         <h3>Add a new entry</h3>
         <Form handleNameChange={handleNameUpdate} handleNumberChange={handleNumberUpdate} newNumber={newNumber} newName={newName} addPersonAction={addPerson} />
         <h3>Numbers</h3>
         <Persons personsToShow={personsToShow} deleteAction={deletePerson} />
      </>
   )
}

export default App
