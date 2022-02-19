import React, {useState} from 'react'

const Button = ( {handleClick, name} ) => {
  return  <button onClick={handleClick}>
            {name}
          </button> 
}

const Statistic = ( {name, value} ) => {
  if(name === "Positive")
    return <>
    <td>{name} </td>
    <td>{value} %</td>
    </>
  else
    return <>
    <td>{name} </td>
    <td>{value}</td>
    </>
}

const Statistics = ( {good, bad, neutral} ) => {
  if(good===0 && bad===0 && neutral===0)
    return <p>No feedback given.</p>
  else
    return  <table>
      <tbody>
        <tr>
          <Statistic name = "Good" value = {good} />
        </tr>
        <tr>
          <Statistic name = "Neutral" value = {neutral} />
        </tr>
        <tr>
          <Statistic name = "Bad" value = {bad} />
        </tr>
        <tr>
          <Statistic name = "All" value = {good + neutral + bad}/>
        </tr>
        <tr>
          <Statistic name = "Average" value = {((good-bad) / (good+bad+neutral)).toFixed(2)}/>
        </tr>
        <tr>
          <Statistic name = "Positive" value={(good / (good+bad+neutral) * 100).toFixed(2)}/>
        </tr>
      </tbody>
    </table>
}


const App = () => {
  // initialise states
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // handlers for updating states
  const incrementGood = () => setGood(good+1)
  const incrementNeutral = () => setNeutral(neutral+1)
  const incrementBad = () => setBad(bad+1)

  return (
    <>
      <h1>Give feedback</h1>
      <Button handleClick = {incrementGood} name = "Good"/>
      <Button handleClick = {incrementNeutral} name = "Neutral"/>
      <Button handleClick = {incrementBad} name = "Bad"/>
      <h1>Statistics</h1>
      <Statistics good={good} bad={bad} neutral={neutral} />
    </>
  )
}

export default App