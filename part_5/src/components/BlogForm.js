import React, { useState } from 'react'

const BlogForm = ({ handleCreateBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')

  return (
    <form>

      <h1>Create New</h1>
      <div>
        title:
        <input
          data-testid='title'
          type='text'
          value={title}
          name='title'
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          data-testid='author'
          type='text'
          value={author}
          name='author'
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          type='text'
          data-testid='url'
          value={url}
          name='url'
          onChange={({ target }) => setURL(target.value)}
        />
      </div>
      <button
        data-testid='createBlog'
        onClick={() => handleCreateBlog(title, author, url)}
        type='button'
      >
        create
      </button>

    </form>
  )
}

export default BlogForm

