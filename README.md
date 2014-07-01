# grunt-timestamp-release

> Release a timestamped version.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-timestamp-release --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-timestamp-release');
```

## The "timestamp_release" task

### Overview
In your project's Gruntfile, add a section named `timestampRelease` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  timestampRelease: {
    options: {
      files: ['package.json'],
      commit: true,
      commitMessage: 'Release <%= timestamp %>',
      tag: true,
      tagFormat: 'YYYY-MM-DD--hh-mm',
      tagMessage: 'Release <%= timestamp %>',
      name: '',
      email: '',
      push: true,
      pushTo: 'upstream'
    }
  }
});
```

### Options

#### options.files
Type: `Array`
Default value: `['package.json']`  

A list of files in which to update the version.

#### options.commit  
Type: `Boolean`
Default value: `true`  

Do you want the changes to be committed?

#### options.commitMessage
Type: `String`
Default value: `"Release <%= timestamp %>"`  

If `options.commit`, what do you want the commit message to be? `<%= timestamp %>` is available for reference.

#### options.tag
Type: `Boolean`
Default value: `true`  

Do you want to tag?

#### options.tagFormat
Type: `String`
Default value: `'YYYY-MM-DD--hh-mm'`  

If `options.tag`, what do you want the timestamp format to be? Refer to [MomentJs
formats](http://momentjs.com/docs/#/parsing/string-format/).

#### options.tagMessage  
Type: `String`
Default value: `"Release <%= timestamp %>`  

If `options.tag`, what do you want the tag message to be? `<%= timestamp %>`, `<%= name %>`
and `<%= email %>` are available for reference. `name` and `email` can be set in the options,
or through the command line.

#### options.name
Type: `String`
Default value: Nothing  

Set this option if you want to use `name` in the tagMessage without specifying it via the command
line.

#### options.email
Type: `String`
Default value: Nothing

Set this option if you want to use `email` in the tagMessage without specifying it via the command
line.

#### options.push
Type: `Boolean`
Default value: `true`  

Do you want to push the changes?

#### options.pushTo
Type: `String`
Default value: `'upstream'`  

If `options.push`, which repo do you want to push to?

### Usage Examples

```
grunt release


grunt release --name "Kyrsten Kelly" --email "kyrsten.kelly@example.com"
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
