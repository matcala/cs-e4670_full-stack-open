var lodash = require('lodash')

const dummy = (blogs) => {
   return 1
}

const totalLikes = (blogs) => {
   return blogs.reduce((sum, curr) => sum + curr.likes, 0)
}

const favoriteBlog = (blogs) => {
   let favorite = blogs[0]
   blogs.forEach(blog => {
      if (favorite.likes < blog.likes) {
         favorite = blog
      }
   })
   return favorite
}

const mostBlogs = (blogs) => {

   if (blogs.length === 0) {
      return null
   }

   const authorByBlogs = lodash.countBy(blogs, 'author')

   let toBeSorted = []
   lodash.forIn(authorByBlogs, function (value, key) {
      toBeSorted = toBeSorted.concat({
         author: key,
         blogs: value,
      })
   })
   toBeSorted.sort((a, b) => b.blogs - a.blogs)
   return toBeSorted[0]
}

const mostLikes = (blogs) => {
   const authorLikes = lodash.reduce(
      blogs,
      (result, blog) => {
         if (!result[blog.author]) {
            result[blog.author] = 0
         }
         result[blog.author] += blog.likes
         return result
      },
      {}
   )

   let sortableAuthors = []
   lodash.forIn(authorLikes, function (value, key) {
      sortableAuthors = sortableAuthors.concat({
         author: key,
         likes: value,
      })
   })
   sortableAuthors.sort((a, b) => b.likes - a.likes)
   return sortableAuthors[0]
}

module.exports = {
   dummy,
   totalLikes,
   favoriteBlog,
   mostBlogs,
   mostLikes,
}

