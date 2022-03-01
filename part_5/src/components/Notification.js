import React from 'react'

const Notification = (props) => {
  
  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  if (props.text === null || props.text === '') {
    return null
  }

  const notifStyle = props.errorState ? errorStyle : notificationStyle
  return (
    <div data-testid='text' style={notifStyle} className='notification'>
      {props.text}
    </div>
  )
}

export default Notification
