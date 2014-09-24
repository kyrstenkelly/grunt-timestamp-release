/*
 * grunt-timestamp-release
 * https://github.com/kyrstenkelly/grunt-timestamp-release
 *
 * Copyright (c) 2014 Kyrsten
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  var moment = require('moment'),
    shell = require('shelljs'),
    q = require('q');

  grunt.registerTask('timestampRelease', 'Release a timestamped version.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
        files: ['package.json'],
        commit: true,
        tag: true,
        tagPrefix: '',
        tagSuffix: '',
        tagFormat: 'YYYY-MM-DD--hh-mm',
        push: true,
        pushTo: 'origin'
      }),
      VERSION_REGEXP = /([\'|\"]?version[\'|\"]?[ ]*:[ ]*[\'|\"]?)([\d||A-a|.|-]*)([\'|\"]?)/i,
      timestampVersion = grunt.option('timestamp') || moment(new Date()).format(options.tagFormat),
      testRun = grunt.option('test-run') || false,
      done = this.async(),
      fileNames = '',
      commitMessage,
      tagMessage,
      templateOpts,
      prefix,
      suffix;

    prefix = grunt.option('tagPrefix') || options.tagPrefix || '';
    suffix = grunt.option('tagSuffix') || options.tagSuffix || '';
    options.name = grunt.option('name') || grunt.config.get('name') || null;
    options.email = grunt.option('email') || grunt.config.get('email') || null;

    commitMessage = grunt.config.getRaw('timestampRelease.options.commitMessage') ||
      'Release <%= timestamp %>';
    tagMessage = grunt.config.getRaw('timestampRelease.options.tagMessage') ||
      'Release <%= timestamp %>';
    templateOpts = {data: {timestamp: timestampVersion, name: options.name,
        email: options.email}};

    try {
      options.commitMessage = grunt.template.process(commitMessage, templateOpts);
    } catch (e) {
      grunt.fail.warn('There was an error processing your commit message.');
    }

    try {
      options.tagMessage = grunt.template.process(tagMessage, templateOpts);
    } catch (e) {
      grunt.fail.warn('There was an error processing your tag message.');
    }

    options.files.forEach(function(fileName) {
      fileNames = fileNames + fileName + ' ';
    });

    function ifSet(option, fn) {
      if (options[option]) {
        return fn;
      }
    }

    function run(command, message) {
      var deferred = q.defer(),
        success;
      grunt.verbose.writeln('Running: ' + command);

      if (testRun) {
        success = true;
      } else {
        success = shell.exec(command, {silent: true});
      }

      if (success) {
        grunt.log.ok(message || command);
        deferred.resolve();
      } else {
        deferred.reject('Failed during: ' + command);
      }

      return deferred.promise;
    }

    function timestamp() {
      return q.fcall(function() {
        grunt.file.expand(options.files).forEach(function(file) {
          var content = grunt.file.read(file).replace(VERSION_REGEXP, function(match, pre, version, post) {
            return pre + timestampVersion + post;
          });

          grunt.file.write(file, content);
          grunt.log.ok('Updating version in ' + file);
        });
      });
    }

    function add() {
      return run('git add ' + fileNames, 'Adding ' + fileNames);
    }

    function commit() {
      return run('git commit -m "' + options.commitMessage + '"', 'Committing ' + fileNames);
    }

    function tag() {
      return run('git tag -s ' + prefix + timestampVersion + suffix + ' -m "'
        + options.tagMessage + '"', 'Tagging ' + prefix + timestampVersion + suffix);
    }

    function push() {
      return run('git push ' + options.pushTo);
    }

    function pushTags() {
      return run('git push ' + options.pushTo + ' --tags');
    }

    if (testRun) {
      grunt.log.ok('Running as a test run!');
    }

    q().then(timestamp)
      .then(ifSet('commit', add))
      .then(ifSet('commit', commit))
      .then(ifSet('tag', tag))
      .then(ifSet('push', push))
      .then(ifSet('push', pushTags))
      .catch(function(message) {
        grunt.fail.warn(message || 'Timestamp release failed');
      })
      .finally(done);

  });

};
