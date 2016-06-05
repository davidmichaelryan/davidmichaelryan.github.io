{assign} = require 'lodash'
request = require "request"
cheerio = require 'cheerio'
recipesController = require '../modules/recipes/controller'

require('dotenv').load();

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
    index_partials = assign {}, base_partials, {work: "work"}
    res.render "index",
      partials: index_partials
  
  app.get "/gifs", (req, res) ->
    res.locals =
      includeJs:
        jquery: true
        gifsJs: true

    gifs_partials = assign {}, base_partials, {gifs: "gifs"}
    res.render "index",
      partials: gifs_partials

  app.get "/getgifs", (req, res) -> ## IN PROGRESS
    dropboxUrl = process.env.DROPBOX_URL
    gifUrl = process.env.DROPBOX_GIF_URL
    request dropboxUrl, (error, response, body) ->
      if error
        res.send error
      else
        gifs = []

        $ = cheerio.load body
        $('a.file-link.thumb-link').each (i, element) ->
          href = $(this).attr 'href'
          urlEnding = href.split("/").pop();
          gifName = urlEnding.substr 0, urlEnding.indexOf '.'
          if gifName?.length
            gifs.push
              name: decodeURI gifName
              url: "#{gifUrl}#{urlEnding}"

        res.locals =
          gifs: gifs

        res.render "gif_list"

  app.get "/recipes", (req, res) ->
    recipesController.main req, res

  app.post "/recipes", (req, res) ->
    recipesController.submit req, res

  app.get '/recipes-linter', (req, res) ->
    recipesController.lint req, res
