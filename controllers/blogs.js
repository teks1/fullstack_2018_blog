const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
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
        const blog = new Blog(body) 
    
        const savedBlog = await blog.save()
        response.json(savedBlog)
      } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong...' })
      }
   
})

module.exports = blogsRouter
