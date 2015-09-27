{extend} = require 'underscore'

base_partials =
  head: "head"
  header: "header"
  footer: "footer"

module.exports = (app) ->
  app.use (req, res, next) ->
    console.log "%s %s", req.method, req.url
    next()
    return

  app.get "/", (req, res) ->
    index_partials = extend {}, base_partials, {work: "work"}
    console.log index_partials
    res.render "index",
      partials: index_partials