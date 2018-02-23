const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
    .find({})
    .populate('user')
    response.json(blogs.map(Blog.format))
})

blogsRouter.post('/', async (request, response) => {
    
    try {
        const body = request.body
        if (body.likes === undefined || body.likes === "") {      
            body.likes = 0
        }
        if (body.title === undefined || body.url === undefined) {
            return response.status(400).json({error: 'no title and/or url'})
        }
        
        const user = await User.findById(body.userId)
        if (user === null) {
            console.log("user null")
            const users = await User.find({})
            console.log(users)
        }
        console.log(user)
        //const blog = new Blog(body) 
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user._id
        })
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.json(Blog.format(savedBlog))
      } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong...' })
      }
   
})

blogsRouter.delete('/:id', async (request, response) => {
    try {
        await Blog.findByIdAndRemove(request.params.id)
        return response.status(204).end()
    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformatted id' })
    }
})

module.exports = blogsRouter
