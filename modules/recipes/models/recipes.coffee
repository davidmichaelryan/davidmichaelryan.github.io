mongoose = require 'mongoose'
Schema = mongoose.Schema

recipeSchema = new Schema
  beenTried: Boolean,
  url: String,
  title: String,
  image: String

module.exports = mongoose.model 'recipe', recipeSchema
