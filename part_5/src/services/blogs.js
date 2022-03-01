import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getAll = async () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (newObject) => {
  console.log(newObject)
  const config = { headers: { Authorization: token } }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const deleteOne = (blogID) => {
  const config = { headers: { Authorization: token } }
  const request = axios.delete(`${baseUrl}/${blogID}`, config)
  return request.then((response) => response.data)
}

const update = async (newObject, blogID) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.put(baseUrl + `/${blogID}`, newObject, config)
  return response.data
}

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}


export default { getAll, create, setToken, update, deleteOne }
