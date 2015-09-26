module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {   
            js: {
                src: [
                    'js/libs/*.js', // All JS in the libs folder
                    'js/*.js'
                ],
                dest: 'build/production.js',
            },
        },
        uglify: {
            build: {
                src: 'build/production.js',
                dest: 'build/production.min.js'
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: ['**/*.{png,jpg,gif}', 'images/*.{png,jpg,gif}'],
                    dest: 'build/images'
                }]
            }
        },
        stylus: {
          compile: {
            files: {
              'build/production.css': 'css/*.styl' // compile and concat into single file
            }
          }
        },
        watch: {
            scripts: {
                files: ['css/*.styl', 'js/*.js'],
                tasks: ['stylus', 'concat', 'uglify'],
                options: {
                    spawn: false,
                },
            } 
        }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-watch');


    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['stylus', 'concat', 'uglify', 'watch']);

};