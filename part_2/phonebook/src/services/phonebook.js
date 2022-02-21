import axios from "axios";
const endpoint = 'http://localhost:3001/persons'

const getAll = () => {
   const request = axios.get(endpoint)
   return request.then(response => response.data)
}

const createPerson = newPerson => {
   const request = axios.post(endpoint, newPerson)
   return request.then(response => response.data)
}

const deletePerson = personId => {
   const url = `${endpoint}/${personId}`
   const request = axios.delete(url)
   return request.then(response => response.data)
}

const updatePerson = person => {
   const url = `${endpoint}/${person.id}`
   const request = axios.put(url, person)
   return request.then(response => response.data)
}

export default { getAll, createPerson, deletePerson, updatePerson }


