/* global module:false */
module.exports = function (grunt) {
    var port = grunt.option('port') || 8000;
    var base = grunt.option('base') || '.';

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*!\n' +

            ' */'
        },


        uglify: {
            options: {
                banner: '<%= meta.banner %>\n'
            },
            build: {
                src: 'js/reveal.js',
                dest: 'js/reveal.min.js'
            },
            bundle: {
                files: {
                    'js/bundle.min.js': ['lib/js/head.min.js', 'js/reveal.js', 'js/_bower.js', 'js/app.js']
                }
            }

        },

        sass: {
            core: {
                files: {
                    'css/reveal.css': 'css/reveal.scss',
                }
            },
            themes: {
                files: [
                    {
                        expand: true,
                        cwd: 'css/theme/source',
                        src: ['*.scss'],
                        dest: 'css/theme',
                        ext: '.css'
                    }
                ]
            }
        },

        autoprefixer: {
            dist: {
                src: 'css/reveal.css'
            }
        },

        cssmin: {
            compress: {
                files: {
                    'css/reveal.min.css': ['css/reveal.css']
                }
            }
        },

        jshint: {
            options: {
                curly: false,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                eqnull: true,
                browser: true,
                expr: true,
                globals: {
                    head: false,
                    module: false,
                    console: false,
                    unescape: false,
                    define: false,
                    exports: false
                }
            },
            files: ['Gruntfile.js', 'js/reveal.js']
        },

        connect: {
            server: {
                options: {
                    port: port,
                    base: base,
                    livereload: true,
                    open: true
                }
            }
        },

        zip: {
            'reveal-js-presentation.zip': [
                'index.html',
                'css/**',
                'js/**',
                'lib/**',
                'images/**',
                'plugin/**',
                '**.md'
            ]
        },

        watch: {
            options: {
                livereload: true
            },
            js: {
                files: ['Gruntfile.js', 'js/reveal.js'],
                tasks: ['js','build']
            },
            theme: {
                files: ['css/theme/source/*.scss', 'css/theme/template/*.scss'],
                tasks: 'css-themes'
            },
            css: {
                files: ['css/reveal.scss'],
                tasks: 'css-core'
            },
            html: {
                files: ['index.html']
            },
            markdown: {
                files: ['./*.md']
            }
        },

        bower_concat: {
            all: {
                dest: {
                    'js': 'js/_bower.js',
                    'css': 'css/_bower.css'
                },
                include: ['jquery', 'jquery-ui', 'jquery.preload', 'bootstrap-sass', 'handlebars'],
                dependencies: {},
                bowerOptions: {
                    relative: false
                }
            }
        },

        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['bower_components/jquery-ui/themes/base/jquery-ui.min.css'],
                        dest: 'css/'
                    }
                ],
            },
        }

    });

    // Dependencies
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // JS task
    grunt.registerTask('js', ['jshint', 'uglify']);

    // Theme CSS
    grunt.registerTask('css-themes', ['sass:themes']);

    // Core framework CSS
    grunt.registerTask('css-core', ['sass:core', 'autoprefixer', 'cssmin']);

    // All CSS
    grunt.registerTask('css', ['sass', 'autoprefixer', 'cssmin']);

    // Package presentation to archive
    grunt.registerTask('package', ['css', 'js', 'zip']);


    // Concat
    grunt.registerTask('build', ['bower_concat', 'copy', 'uglify']);

    // Default task
    grunt.registerTask('default', ['connect', 'watch']);

};
