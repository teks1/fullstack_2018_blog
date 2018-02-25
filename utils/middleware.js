const logger = (request, response, next) => {
  if ( process.env.NODE_ENV === 'test' ) {
    return next()
  }  
  console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }
  
  const error = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

  const tokenExtractor = (request, response, next) => {
    console.log("token extractor")
    //console.log(request)
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        //request.set('token', authorization.substring(7))
        request.token = authorization.substring(7)
        //console.log(request.token)
        return next()
    }
    return next()
  }
  
  module.exports = {
    logger,
    error, 
    tokenExtractor
  }
  