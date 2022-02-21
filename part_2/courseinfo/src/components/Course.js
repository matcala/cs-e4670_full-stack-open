import React from 'react'
import Header from './Header'
import Content from './Content'
import Total from './Total'

const Course = (props) => {
   return (
      <>
         <Header name={props.course.name} />
         <Content parts={props.course.parts} />
         <Total course={props.course} />
      </>
   )

}

export default Course;