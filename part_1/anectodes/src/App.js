import React, { useState } from 'react'

const Button = ({ handleClick, name }) => {
   return <button onClick={handleClick}>{name}</button>
}

const App = () => {
   const anecdotes = [
      'If it hurts, do it more often',
      'Adding manpower to a late software project makes it later!',
      'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
      'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
      'Premature optimization is the root of all evil.',
      'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
      'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
   ]

   const [current, setCurrent] = useState(0)
   const [points, setPoints] = useState(new Array(7).fill(0))
   const [mostVoted, setMostVoted] = useState(0)

   const nextAnectode = () => {
      // random int between 0 and 6
      let randomNum = Math.floor(Math.random() * 7)
      setCurrent(randomNum)
   }

   const vote = () => {
      const copy = [...points]
      copy[current] += 1
      // check for new most voted
      if (copy[current] > copy[mostVoted])
         setMostVoted(current)
      // update votes
      setPoints(copy)
   }

   return (
      <>
         <div>
            <h1>Anectode of the day</h1>
            {anecdotes[current]}
            <p>has {points[current]} votes</p>
         </div>
         <div>
            <Button name="Next Anectode" handleClick={nextAnectode} />
            <Button name="Vote" handleClick={vote} />
            <h1>Anectode with most votes</h1>
            {anecdotes[mostVoted]}
            <p>has {points[mostVoted]} votes</p>
         </div>
      </>
   )
}

export default App