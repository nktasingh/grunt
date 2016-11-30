module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        banner: '/*!\n * <%= pkg.name %>\n * Version: <%= pkg.version %>\n * Fusiform, Inc. https://www.fusiform.co/\n */\n',
				mangle: false,
        compress: {
      		sequences: true,
          properties: true,
      		dead_code: true,
      		conditionals: true,
          evaluate: true,
      		booleans: true,
          loops: true,
      		unused: true,
          hoist_funs: true,
      		if_return: true,
          cascade: true,
          collapse_vars: true,
          reduce_vars: true,
          negate_iife: true,
      		join_vars: true,
      		drop_console: true
      	}
      },
      dist: {
        files: [
					{src: ['ng-form-builder.js', 'diagram-input.js', 'dist/templates.js'], dest: 'dist/<%= pkg.name %>.min.js'}

        ]
      }
    },

    cssmin: {
      options: {},
      dist: {
        files: [
          {src: ['ng-form-builder.css'], dest: 'dist/<%= pkg.name %>.min.css'}
        ]
      }
    },

		bump: {
      options: {
        files: ['*.json', 'dist/<%= pkg.name %>.min.js'],
        updateConfigs: ['pkg'],
        globalReplace: true,
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        commit: true,
				commitMessage: 'Release v%VERSION%',
	      commitFiles: ['-a'],
        push: true,
				pushTo: 'origin'
      }
    }

  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-bump');

	// Templates task
	grunt.registerTask(
		'templates',
		'Put templates into $templateCache',
		function(templateDir) {
			if(!templateDir) {
				grunt.log.error("A templateDir argument must be given.");
				return;
			}

			var file = grunt.file.read(grunt.config.get('pkg').main);
			var moduleName = file.match(/module[^,]*/)[0].match(/[\'\"][^,]*/);
			var newFile = "angular.module(" + moduleName + ").run(['$templateCache', function($templateCache) {\n";
			var templates = grunt.file.expand(templateDir);
			var string;

			templates.forEach(function(template) {
				file = grunt.file.read(template).split("");
				string = "";

				for(var i = 0; i < file.length; i++) {
					if(file[i] == '\n'|'\r') {
						continue;
					} else if (file[i] === "'") {
						string = string + "\\'";
					} else {
						string = string + file[i];
					}
				}
				newFile = newFile + "$templateCache.put(" + "'" + template + "', " + "'" + string + "');\n";
			})
			newFile = newFile + "}]);";
			grunt.file.write('dist/templates.js', newFile);
			grunt.log.ok();
		});

	// Clean task
	grunt.registerTask(
		'clean',
		'Clean dist/templates.js',
		function() {
			grunt.file.delete('dist/templates.js');
		}
	);

  // Build task
  grunt.registerTask(
    'build',
    'Build the distribution version.',
    ['templates:templates/*.html', 'uglify', 'cssmin', 'clean']);

	// Bump task doesn't need a grunt registered task
  // grunt bump       - 0.0.x
  // grunt bump:patch - 0.0.x
  // grunt bump:minor - 0.x.0
  // grunt bump:major - x.0.0
  // grunt bump --setversion=2.0.1
  // Docs: https://github.com/vojtajina/grunt-bump
};
