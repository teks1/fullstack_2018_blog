const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12
    }
  ]

beforeAll(async () => {
    await Blog.remove({})

    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
  
    expect(response.body.length).toBe(initialBlogs.length)
  })

  test('a valid blog can be added ', async () => {
    const newBlog = {
        "title": "New blog",
        "author": "fullstack",
        "url": "https://fullstack-hy.github.io",
        "likes": 12
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const response = await api
      .get('/api/blogs')
  
    const contents = response.body.map(r => r.author)
  
    expect(response.body.length).toBe(initialBlogs.length + 1)
    expect(contents).toContain('fullstack')
  })

  test('a blog without likes gets 0', async () => {
    const newBlog = {
        "title": "Zero blog",
        "author": "zzz",
        "url": "https://fullstack-hy.github.io"
        
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const response = await api
      .get('/api/blogs')
    const likes = response.body[response.body.length - 1].likes
    expect(likes).toBe(0)
  })

  test('a blog without title is not added ', async () => {
    const newBlog = {
        "author": "fullstack",
        "url": "https://fullstack-hy.github.io",
        "likes": 12
    }
  
    const initialBlogs = await api
      .get('/api/blogs')
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
    const response = await api
      .get('/api/blogs')
    expect(response.body.length).toBe(initialBlogs.body.length)
  })

afterAll(() => {
    server.close()
})