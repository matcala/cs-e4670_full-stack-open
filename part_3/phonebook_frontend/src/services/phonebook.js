import axios from "axios";
const baseUrl = '/api/persons'

const getAll = () => {
   const request = axios.get(baseUrl)
   return request.then(response => response.data)
}

const createPerson = newPerson => {
   const request = axios.post(baseUrl, newPerson)
   return request.then(response => response.data)
}

const deletePerson = personId => {
   const url = `${baseUrl}/${personId}`
   const request = axios.delete(url)
   return request.then(response => response.data)
}

const updatePerson = person => {
   const url = `${baseUrl}/${person.id}`
   const request = axios.put(url, person)
   return request.then(response => response.data)
}

export default { getAll, createPerson, deletePerson, updatePerson }


