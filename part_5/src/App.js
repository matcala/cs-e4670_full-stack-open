import React, { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationText, setNotificationText] = useState(null)
  const [errorState, setErrorState] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const likeClick = async (blog) => {
    const newBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
    const blogID = blog.id
    await blogService.update(newBlog, blog.id)
    const updatedBlog = {
      ...newBlog,
      blogID,
    }
    setBlogs(
      blogs.map((tempBlog) =>
        blog.id === tempBlog.id ? updatedBlog : tempBlog
      )
    )
  }

  const deleteFunction = async (id) => {
    await blogService.deleteOne(id)
    setBlogs(blogs.filter((blog) => blog.id !== id))
    setNotificationText('successfully deleted')
    setErrorState(false)
    setTimeout(() => {
      setNotificationText(null)
    }, 5000)
  }

  const handleCreateBlog = async (title, author, url) => {
    blogFormRef.current.toggleVisibility()
    try {
      const newObject = {
        title: title,
        author: author,
        url: url,
      }
      const response = await blogService.create(newObject)
      const newBlogs = [...blogs, response]
      setBlogs(newBlogs)
      setNotificationText('a new blog ' + title + ' by ' + author + ' added')
      setErrorState(false)
      setTimeout(() => {
        setNotificationText(null)
      }, 5000)
    } catch (exception) {
      console.log(exception)
      setNotificationText('wrong username or password')
      setErrorState(true)
      setTimeout(() => {
        setNotificationText(null)
      }, 5000)
    }
  }

  const logout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  return (
    <div>
      <h2 data-testid='title-blogs'>blogs</h2>
      <Notification text={notificationText} errorState={errorState} />
      {user === null ? (
        <LoginForm
          setNotificationText={setNotificationText}
          setErrorState={setErrorState}
          username={username}
          password={password}
          setUser={setUser}
          setPassword={setPassword}
          setUsername={setUsername}
        />
      ) : (
        <div>
          <p>
            {user.name} logged in
            <button data-testid='logout-button' onClick={logout}>
              logout
            </button>
          </p>
          <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm handleCreateBlog={handleCreateBlog} />
          </Togglable>
          {blogs.sort((a, b) => b.likes - a.likes) &&
            blogs.map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                likeClick={() => likeClick(blog)}
                deleteFunction={() => deleteFunction(blog.id)}
              />
            ))}
        </div>
      )}
    </div>
  )
}

export default App
