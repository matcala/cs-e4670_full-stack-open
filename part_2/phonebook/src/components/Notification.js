import React from "react"

const Notification = ({ message, isError }) => {

   const notificationStyle = {
      color: "green",
      background: "lightgrey",
      fontSize: 20,
      borderStyle: "solid",
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      textAlign: "center"
   }

   const errorStyle = {
      color: "red",
      background: "lightgrey",
      fontSize: 20,
      borderStyle: "solid",
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      textAlign: "center"
   }

   const currentStyle = isError ? errorStyle : notificationStyle

   if (message === null) {
      return null
   }

   return (
      <div style={currentStyle} className="error">
         {message}
      </div>
   )
}

export default Notification

