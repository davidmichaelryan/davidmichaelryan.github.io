module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    coffee:    
      build:           
        files: [
          expand: true
          cwd: 'public/coffeescript'
          src: ['*.coffee']
          dest: 'build/js'
          ext: '.js' 
        ]
    stylus:
      compile:
        options:
          "include css": true
        files: [
          expand: true
          cwd: 'public/stylus'
          src: ['*.styl']
          dest: "build/css"
          ext: ".css"
        ]
    watch: 
      files: ['public/stylus/*.styl', 'public/coffeescript/*.coffee']
      tasks: ['stylus', 'coffee']

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-stylus'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'default', ['stylus', 'coffee', 'watch']