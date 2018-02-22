const dummy = (blogs) => {
    return 1
  }
  
const totalLikes = (blogs) => {
    const reducer = (sum, item) => sum + item;
    const likes = blogs.map(b => b.likes)
    return blogs.length === 0 ? 0 : likes.reduce(reducer)
}

const favoriteBlog = (blogs) => {
    let favBlog = undefined
    let maxLikes = 0
    blogs.forEach(blog => {
        if (blog.likes > maxLikes) {
            maxLikes = blog.likes
            favBlog = blog
        }
    });

    return favBlog
}

const mostBlogs = (blogs) => {
    let blogsMappedByAuthor = []
    blogs.forEach(blog => {
        index = blogsMappedByAuthor.findIndex(b => b.author === blog.author)
        if (index < 0) {
            blogsMappedByAuthor.push({author: blog.author,
            blogs: 1})
        } else {
            //console.log(blogsMappedByAuthor[index])
            blogsMappedByAuthor[index].blogs = blogsMappedByAuthor[index].blogs + 1;
        }
    })
    //console.log(blogsMappedByAuthor)
    blogsMappedByAuthor.sort(function (a, b) {
        return b.blogs - a.blogs;
      });
    //console.log(blogsMappedByAuthor)
    return blogs.length === 0 ? "no blogs" : blogsMappedByAuthor[0]
}

const mostLikes = (blogs) => {
    let blogsMappedByAuthor = []
    blogs.forEach(blog => {
        index = blogsMappedByAuthor.findIndex(b => b.author === blog.author)
        if (index < 0) {
            blogsMappedByAuthor.push({author: blog.author,
            likes: blog.likes})
        } else {
            blogsMappedByAuthor[index].likes = blogsMappedByAuthor[index].likes + blog.likes;
        }
    }) 
    blogsMappedByAuthor.sort(function (a, b) {
        return b.likes - a.likes;
      });
    return blogs.length === 0 ? "no blogs" : blogsMappedByAuthor[0]
}

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
