const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeAll(async () => {
    await Blog.remove({})

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
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
  
    expect(response.body.length).toBe(helper.initialBlogs.length)
  })

  test('a valid blog can be added ', async () => {
    const newBlog = {
        "title": "New blog",
        "author": "fullstack",
        "url": "https://fullstack-hy.github.io",
        "likes": 12
    }
    const blogsBefore = await helper.blogsInDb()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const blogsAfter = await helper.blogsInDb()

  expect(blogsAfter.length).toBe(blogsBefore.length+1)
  //expect(blogsAfter).toContainEqual(newBlog)
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
  
    const initialBlogs = await helper.blogsInDb()
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
    const response = await helper.blogsInDb()
    expect(response.length).toBe(initialBlogs.length)
  })

afterAll(() => {
    server.close()
})