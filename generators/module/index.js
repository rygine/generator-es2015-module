'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var mkdirp = require('mkdirp');
var _ = require('underscore.string');

var ES2015ModuleGenerator = yeoman.generators.Base.extend({

  init: function () {
    this.pkg = this.fs.readJSON(path.join(__dirname, '../package.json'));
  },

  prompting: function () {
    var done = this.async();

    this.log(yosay(
      'Welcome to the ' + chalk.red('ES2015 Module') + ' generator!'
    ));

    this.module = path.basename(process.cwd());

    var prompts = [
      {
        name: 'module',
        message: 'What would you like to call your module?',
        default: this.module
      },
      {
        name: 'author',
        message: 'What is your name?'
      },
      {
        name: 'email',
        message: 'What is your email?'
      }
    ];

    this.prompt(prompts, function(props) {
      this.props = props;
      this.props.module = _.slugify(props.module || this.module);
      this.props.year = new Date().getFullYear();
      this.appRoot = path.basename(process.cwd()) === this.props.module ?
        this.destinationRoot() :
        path.join(this.destinationRoot(), this.props.module);
      if (process.cwd() !== this.appRoot) {
        mkdirp(this.appRoot);
        process.chdir(this.appRoot);
      }
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
      this.fs.copyTpl(
        this.templatePath('test.js'),
        this.destinationPath('test/' + this.props.module + '-test.js'),
        this.props
      );
    }

  }

});

module.exports = ES2015ModuleGenerator;
