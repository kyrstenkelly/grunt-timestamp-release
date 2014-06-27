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

  grunt.registerTask('timestamp_release', 'Release a timestamped version.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      files: ['package.json'],
      commit: true,
      commitMessage: 'Release <%= timestamp %>',
      tag: true,
      tagFormat: 'YYYY-MM-DD--hh-mm',
      tagMessage: 'Release <%= timestamp %>',
      push: true,
      pushTo: 'upstream'
    });

    var VERSION_REGEXP = /([\'|\"]?version[\'|\"]?[ ]*:[ ]*[\'|\"]?)([\d||A-a|.|-]*)([\'|\"]?)/i,
      now = moment(),
      timestampVersion = moment(now).format(options.tagFormat),
      fileNames = '';

    var defaultCommitMsg = 'Release <%= timestamp %>',
      defaultTagMsg = 'Release <%= timestamp %>',
      templateOpts = {data: {timestamp: timestampVersion}};

    options.commitMessage = grunt.template.process(options.commitMessage || defaultCommitMsg,
      templateOpts);
    options.tagMessage = grunt.template.process(options.tagMessage || defaultTagMsg,
      templateOpts);

    options.files.forEach(function(fileName) {
      fileNames = fileNames + fileName + ' ';
    });

    function ifSet(option, fn) {
      if (options[option]) {
        return fn();
      }
    }

    function run(command, message) {
      var deferred = q.defer(),
        success;
      grunt.verbose.writeln('Running: ' + command);

      success = shell.exec(command, {silent: true });

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

    }

    function push() {

    }

    q().then(timestamp)
      .then(ifSet('commit', add))
      .then(ifSet('commit', commit))
      .then(ifSet('tag', tag))
      .then(ifSet('push', push));

  });

};
