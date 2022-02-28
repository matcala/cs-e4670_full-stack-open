import React from 'react'

const Filter = (props) => {
   return (
      <div>
         Filter shown with <input value={props.newFilter} onChange={props.handleFilterChange} />
      </div>
   )
}

export default Filter;

