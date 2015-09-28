{extend} = require 'underscore'
request = require "request"
cheerio = require 'cheerio'

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
    index_partials = extend {}, base_partials, {work: "work"}
    res.render "index",
      partials: index_partials
  
  app.get "/gifs", (req, res) ->
    res.locals =
      includeJs:
        jquery: true

    gifs_partials = extend {}, base_partials, {gifs: "gifs"}
    res.render "index",
      partials: gifs_partials
  
  app.get "/getgifs", (req, res) ->
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
