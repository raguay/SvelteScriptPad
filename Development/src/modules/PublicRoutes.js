const bodyParser = window.bodyparser;

module.exports = (router, ScriptPad) => {
  //
  // Here, we need to setup the middleware for the router. The first
  // two are for parsing the body of a request. The third & fourth one is a 
  // security checker. We are going to allow non-API calls only from our
  // system, while API calls are limited to our sub-domain.
  //
  router.use('*', (req, res, next) => {
    //
    // We need to do some security checking on all the API calls.
    //
    var okay = true
    var requesterIP = req.ip.split('.')
    var localIP = req.connection.localAddress.split('.')
    if ((requesterIP[0] === localIP[0]) && (requesterIP[1] === localIP[1]) && (requesterIP[2] === localIP[2]) && (requesterIP[0] === localIP[0])) {
      //
      // Okay, the request is within our sub-domain. You can allow it.
      //
      okay = true
    } else {
      okay = false
    }
    //
    // If okay is true, proceed. Otherwise, just drop out.
    //
    if (okay) {
      next()
    }
  })
  router.use(bodyParser.json()) // for parsing application/json
  router.use(bodyParser.urlencoded({
    extended: true
  })) // for parsing application/x-www-form-urlencoded
  
  router.use('/', window.express.static('ScriptServer'))
  router.use('/docs', window.express.static('docs'))
  router.use('/imgs', window.express.static('scriptpad/imgs'))
}
