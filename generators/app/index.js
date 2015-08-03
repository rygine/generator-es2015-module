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
      },
      {
        name: 'githubUser',
        message: 'What is your github user name?'
      },
      {
        name: 'license',
        message: 'What license would you like to use?',
        default: 'MIT'
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

    app: function() {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        this.props
      );
    },

    projectfiles: function() {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('eslintrc'),
        this.destinationPath('.eslintrc')
      );
      this.fs.copy(
        this.templatePath('babelrc'),
        this.destinationPath('.babelrc')
      );
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copy(
        this.templatePath('npmignore'),
        this.destinationPath('.npmignore')
      );
      this.fs.copy(
        this.templatePath('LICENSE'),
        this.destinationPath('LICENSE')
      );
      this.fs.copy(
        this.templatePath('README.md'),
        this.destinationPath('README.md')
      );
      this.fs.copy(
        this.templatePath('CHANGELOG.md'),
        this.destinationPath('CHANGELOG.md')
      );
      this.fs.copyTpl(
        this.templatePath('src/index.js'),
        this.destinationPath('src/' + this.props.module + '.js'),
        this.props
      );
      this.fs.copy(
        this.templatePath('test/harness.js'),
        this.destinationPath('test/harness.js')
      );
      this.fs.copyTpl(
        this.templatePath('test/test.js'),
        this.destinationPath('test/' + this.props.module + '-test.js'),
        this.props
      );
    }

  },

  install: function() {
    if (!this.options['skip-install']) {
      this.installDependencies();
    }
  }

});

module.exports = ES2015ModuleGenerator;
