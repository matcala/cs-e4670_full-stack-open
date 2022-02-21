import React from 'react'

const Person = ({ person, deleteAction }) => {
   return (
      <li key={person.name} >{person.name}: {person.number} <button onClick={() => deleteAction(person)}>delete</button></li>
   )
}

export default Person

