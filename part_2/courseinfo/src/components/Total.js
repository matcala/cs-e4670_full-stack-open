import React from 'react'

const Total = ({ course }) => {

   // reduce takes (total, currentValue, currentIndex, arr)
   const sum = course.parts.reduce(
      (total, part) => {
         return total + part.exercises
      }, 0
   );

   return (
      <b>Total of: {sum} exercises</b>
   )
}

export default Total;