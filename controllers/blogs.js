const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

/**
const getTokenFrom = (request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}
**/

const verifyToken = (request) => {
    try {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        return decodedToken
    } catch (exception) {
        return null
        //return response.status(401).send({ error: 'check token' })
    }
}

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
    .find({})
    .populate('user', {username: 1, name: 1})
    response.json(blogs.map(Blog.format))
})

blogsRouter.post('/', async (request, response) => {
    
    try {
        const body = request.body
        //const token = getTokenFrom(request)
        //const decodedToken = jwt.verify(token, process.env.SECRET)
        const decodedToken = verifyToken(request)
        if (decodedToken === null) {
            return response.status(401).send({ error: 'check token' })
        }
        if (body.likes === undefined || body.likes === "") {      
            body.likes = 0
        }
        if (body.title === undefined || body.url === undefined) {
            return response.status(400).json({error: 'no title and/or url'})
        }
        
        const user = await User.findById(decodedToken.id)
        //console.log(user)
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
        if (exception.name === 'JsonWebTokenError' ) {
            console.log(exception.message)
            response.status(401).json({ error: exception.message })
          } else {
            console.log(exception)
            response.status(500).json({ error: 'something went wrong...' })
          }
        }
})

blogsRouter.delete('/:id', async (request, response) => {
    try {
        //await Blog.findByIdAndRemove(request.params.id)
        //const decodedToken = jwt.verify(request.token, process.env.SECRET)
        const decodedToken = verifyToken(request)
        const blog = await Blog.findById(request.params.id)
        if (decodedToken === null) {
            return response.status(401).send({ error: 'check token' })
        }
        if (decodedToken.id.toString() === blog.user.toString()) {
            await Blog.findByIdAndRemove(request.params.id)
            return response.status(204).end()
        }
        return response.status(500).end()
    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformatted id' })
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
  
	const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
}
    try {
        const modifiedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true } )
        return response.json(Blog.format(modifiedBlog))
    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformatted id' })
    }
})

module.exports = blogsRouter
