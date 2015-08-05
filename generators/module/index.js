'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var _s = require('underscore.string');
var _ = require('lodash');

var ES2015ModuleModuleGenerator = yeoman.generators.Base.extend({

  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
    this.option('skip-test', {
      desc: 'Do not create a unit test file for the module',
      type: Boolean,
      defaults: false
    });
  },

  initializing: function () {
    this.pkg = this.fs.readJSON(path.join(process.cwd(), './package.json'));
  },

  prompting: function () {
    var done = this.async();

    this.log(yosay(
      'Welcome to the ' + chalk.red('ES2015 Module') + ' module generator!'
    ));

    this.module = path.basename(process.cwd());

    var prompts = [
      {
        name: 'module',
        message: 'What would you like to call your module?',
        default: this.module
      }
    ];

    this.prompt(prompts, function(props) {
      var author;
      this.props = props;
      this.props.module = _s.slugify(props.module || this.module);
      var year = new Date().getFullYear();
      if (this.pkg && _.isPlainObject(this.pkg.author)) {
        author = this.pkg.author.name;
      }
      this.props.copyright = author ? [
        '/**',
        ' * Copyright (c) ' + year + ', ' + author,
        ' */'
      ].join('\n') : '';
      done();
    }.bind(this));
  },

  writing: {

    projectfiles: function() {
      this.fs.copyTpl(
        this.templatePath('module.js'),
        this.destinationPath('src/' + this.props.module + '.js'),
        this.props
      );
      if (!this.options['skip-test']) {
        this.fs.copyTpl(
          this.templatePath('test.js'),
          this.destinationPath('test/' + this.props.module + '-test.js'),
          this.props
        );
      }
    }

  }

});

module.exports = ES2015ModuleModuleGenerator;
