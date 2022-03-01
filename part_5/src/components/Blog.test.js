import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

test('title and author get renedered but url and likes do not', async () => {

  const blog = {
    title: 'this is test blog',
    author: 'mr test',
    url: 'test.test',
    likes: 6,
  }

  const component = render(<Blog blog={blog} />)

  const blogTitleAuthor = component.getByTestId('blogTitleAuthor')

  const url = await component.queryByTestId('url')
  const likes = await component.queryByTestId('likes')

  expect(blogTitleAuthor).toHaveTextContent('test blog')

  expect(url).toBeNull()
  expect(likes).toBeNull()
})

test('click show more shows more', async () => {

  const blog = {
    title: 'test blog',
    author: 'mr test',
    url: 'test.com',
    likes: 6,
  }

  const component = render(<Blog blog={blog} />)

  const viewButton = component.getByTestId('viewButton')
  userEvent.click(viewButton)

  const blogTitleAuthor = component.getByTestId('blogTitleAuthor')
  const url = await component.queryByTestId('url')
  const likes = await component.queryByTestId('likes')

  expect(blogTitleAuthor).toHaveTextContent('test blog')
  expect(url).toHaveTextContent('test.com')
  expect(likes).toHaveTextContent('6')
})

test('clicking like twice calls event handler twice', async () => {

  const blog = {
    title: 'test blog',
    author: 'mr test',
    url: 'test.com',
    likes: 6,
  }
  const mockHandler = jest.fn()
  const component = render(<Blog blog={blog} likeClick={mockHandler} />)

  const viewButton = component.getByTestId('viewButton')

  userEvent.click(viewButton)

  const likeButton = component.getByTestId('likeButton')

  await userEvent.click(likeButton)
  await userEvent.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('blog creation returns correct details', async () => {

  const createBlog = jest.fn()
  const component = render(<BlogForm handleCreateBlog={createBlog} />)

  const titleInput = component.getByTestId('title')
  userEvent.type(titleInput, 'this is a test blog')

  const authorInput = component.getByTestId('author')
  userEvent.type(authorInput, 'mr test')

  const urlInput = component.getByTestId('url')
  userEvent.type(urlInput, 'test.com')

  userEvent.click(component.getByTestId('createBlog'))

  expect(createBlog).toBeCalledWith('this is a test blog', 'mr test', 'test.com')
})

