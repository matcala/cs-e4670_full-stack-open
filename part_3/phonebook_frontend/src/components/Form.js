import React from 'react'

const Form = (props) => {
   return (
      <form onSubmit={props.addPersonAction}>
         <div>
            Name: <input value={props.newName} onChange={props.handleNameChange} />
         </div>
         <div>
            Number: <input value={props.newNumber} onChange={props.handleNumberChange} />
         </div>
         <div>
            <button type="submit">add</button>
         </div>
      </form>
   )
}

export default Form

