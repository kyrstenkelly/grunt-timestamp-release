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
      timestampVersion = moment(now).format(options.tagFormat);

    console.log(timestampVersion);
/*
    q().then(timestamp)
      .then(ifSet(commit))
      .then(ifSet(tag))
      .then(ifSet(push))

    function timestamp() {
      return Q.fcall(function() {
        grunt.file.expand(options.files).forEach(function(file) {
          var content = grunt.file.read(file).replace(VERSION_REGEXP, function(version, pre, version, post) {
            return pre + timestamp + post;
          });
        });
      });
    }
*/
  });

};
