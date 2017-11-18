#!/usr/bin/env node
/**
 * Created by liangshan on 2017/11/16.
 */

'use strict';

const path = require('path');
const fs = require('fs');
const shelljs = require('shelljs');
const program = require('commander');
const inquirer = require('inquirer');
const pkg = require('../package.json');
let prompt = inquirer.createPromptModule();

const styles = {
  'bold'          : '\x1B[1m%s\x1B[22m',
  'italic'        : '\x1B[3m%s\x1B[23m',
  'underline'     : '\x1B[4m%s\x1B[24m',
  'inverse'       : '\x1B[7m%s\x1B[27m',
  'strikethrough' : '\x1B[9m%s\x1B[29m',
  'white'         : '\x1B[37m%s\x1B[39m',
  'grey'          : '\x1B[90m%s\x1B[39m',
  'black'         : '\x1B[30m%s\x1B[39m',
  'blue'          : '\x1B[34m%s\x1B[39m',
  'cyan'          : '\x1B[36m%s\x1B[39m',
  'green'         : '\x1B[32m%s\x1B[39m',
  'magenta'       : '\x1B[35m%s\x1B[39m',
  'red'           : '\x1B[31m%s\x1B[39m',
  'yellow'        : '\x1B[33m%s\x1B[39m',
  'whiteBG'       : '\x1B[47m%s\x1B[49m',
  'greyBG'        : '\x1B[49;5;8m%s\x1B[49m',
  'blackBG'       : '\x1B[40m%s\x1B[49m',
  'blueBG'        : '\x1B[44m%s\x1B[49m',
  'cyanBG'        : '\x1B[46m%s\x1B[49m',
  'greenBG'       : '\x1B[42m%s\x1B[49m',
  'magentaBG'     : '\x1B[45m%s\x1B[49m',
  'redBG'         : '\x1B[41m%s\x1B[49m',
  'yellowBG'      : '\x1B[43m%s\x1B[49m'
};

const validateName = function (input) {
  let done = this.async();

  if (input.trim() === '') {
    done('项目名不能为空')
  }
  done(null, true);
};

const isEmptyObj = function (obj) {
  var t;
  for (t in obj)
    return !1
  return !0
};

const getAllPlugins = function () {
  const sep = path.sep;
  let templatesPath = path.resolve(__dirname, `.${sep}plugins`);
  let filenames = fs.readdirSync(templatesPath);

  let allPlugins = [];
  let allPluginsConfig = [];
  let pluginChoice = [];
  filenames.forEach(function (fname) {
    let _realFilePath = path.join(templatesPath, fname);
    let _stat = fs.statSync(_realFilePath);
    if (_stat.isDirectory()) {
      let _realFiles = fs.readdirSync(_realFilePath);
      if (_realFiles.indexOf('index.js') > -1) {
        // 存在index.js，则认为是有效的插件
        allPlugins.push(fname);
        pluginChoice.push({
          name: fname,
          value: fname
        });
        let _config = {};
        try {
          _config = require(path.join(_realFilePath, 'package.json'));
        } catch (err) {
          _config = {};
        }
        allPluginsConfig.push({
          name: fname,
          value: _config
        });
      }
    }
  });
  return [allPlugins, pluginChoice, allPluginsConfig];
};

const pluginsCommandList = function (opts) {
  let allPluginsConfig = opts.allPluginsConfig;
  for (let i = 0; i < allPluginsConfig.length; i++) {
    if (i === 0) { console.log(' '); }

    if (isEmptyObj(allPluginsConfig[i].value)) {
      console.log(`${styles.green}`, `- ${allPluginsConfig[i].name}`);
    } else {
      console.log(`${styles.green}`, `- ${allPluginsConfig[i].name}: ${allPluginsConfig[i].value.description}`);
      console.log(`${styles.black}`, `   Author: ${allPluginsConfig[i].value.author.name} ${allPluginsConfig[i].value.author.email}`);
      console.log(`${styles.grey}`, `   Latest: v${allPluginsConfig[i].value.version}`);
    }

    if (i === allPluginsConfig.length - 1) { console.log(' '); }
  }
  // console.log(`${styles.grey}`, '\n   所有命令如下：');
  // console.log(`${styles.grey}`, '\n     └── add   (添加一个插件): zpm plugins add 插件名');
  // console.log(`${styles.grey}`, '\n     └── list  (显示所有插件): zpm plugins list\n');
};

const pluginsCommandAdd = function (opts) {
  const sep = path.sep;
  let questions = [];
  let pluginInfo = {
    plugins: []
  };
  // 所有插件
  let plugins = opts.plugins;
  // 待安装的插件列表
  let newPlugins = opts.args.slice(4);
  // 不存在的插件
  let illegalPlugins = [];
  // 存在的插件
  let legalPlugins = [];
  newPlugins.forEach(function (p) {
    if (plugins.indexOf(p) < 0) {
      illegalPlugins.push(p);
    } else {
      legalPlugins.push(p);
    }
  });
  if (legalPlugins.length < 1) {
    // 无合法的插件
    questions = [
      {
        type: 'checkbox',
        name: 'plugins',
        message: '请选择待安装的插件',
        choices: opts.pluginsChoice
      }
    ]
  } else {

  }
  if (illegalPlugins.length > 0) {
    // 不正确的插件名
    console.log(`${styles.magenta}`, `\n  插件 ${illegalPlugins.join('、')} 不存在！\n`);
  }
  prompt(questions).then(function (answers) {
    if (answers.plugins) {
      pluginInfo.plugins = answers.plugins;
      legalPlugins = answers.plugins;
    }
    let realPath = path.resolve(process.cwd(), './plugins');
    fs.exists(realPath, function (exists) {
      if (!exists) {
        shelljs.exec(`mkdir ${realPath}`);
      }
      let successInstalled = [];
      let failInstalled = [];
      legalPlugins.forEach(function (plugin) {
        try {
          shelljs.cp('-R', `${path.join(__dirname, '.' + sep)}plugins${sep}${plugin}${sep}index.js`, `${realPath}${sep}${plugin}.js`);
          successInstalled.push(plugin);
        } catch (err) {
          failInstalled.push(plugin);
        }
      });
      if (successInstalled.length > 0) {
        console.log(`${styles.green}`, `\n  插件 ${successInstalled.join('、')} 添加成功\n`);
      }
      if (failInstalled.length > 0) {
        console.log(`${styles.magenta}`, `\n  插件 ${failInstalled.join('、')} 添加失败\n`);
      }
    });
  });
};

program
  .version(`${pkg.version}`);

program
  .command('init')
  .description('初始化项目: zpm init [, project_template] [, project_name] [, project_path]')
  .action(function () {
    let sep = path.sep;
    let defaultPath = `.${sep}`;
    let questions = [];
    let projectInfo = {
      template: 'default',
      name: '',
      path: defaultPath
    };

    let allTemplates = [];
    let templateChoices = []
    let templatesPath = path.resolve(__dirname, `.${sep}templates`);
    let filenames = fs.readdirSync(templatesPath);

    filenames.forEach(function (fname) {
      let _realFilePath = path.join(templatesPath, fname);
      let _stat = fs.statSync(_realFilePath);
      if (_stat.isDirectory()) {
        allTemplates.push(fname);
        templateChoices.push({
          name: fname,
          value: fname
        })
      }
    });

    let args = process.argv;
    if (allTemplates.indexOf(args[3]) < 0 && args.length > 3) {
      console.log(`${styles.red}`, `\n 模板 ${args[3]} 不存在\n`);
      questions = [
        {
          type: 'list',
          name: 'project_template',
          message: '请选择模板',
          default: 0,
          choices: templateChoices
        },
        {
          type: 'input',
          name: 'project_name',
          message: '请输入项目名称',
          default: args.length >= 5 ? args[4] : null,
          validate: validateName
        },
        {
          type: 'input',
          name: 'project_path',
          message: '请输入项目路径',
          default: args.length >= 6 ? args[5] : defaultPath
        }
      ]
    } else {
      if (args.length === 3) {
        questions = [
          {
            type: 'list',
            name: 'project_template',
            message: '请选择模板',
            default: 0,
            choices: templateChoices
          },
          {
            type: 'input',
            name: 'project_name',
            message: '请输入项目名称',
            validate: validateName
          },
          {
            type: 'input',
            name: 'project_path',
            message: '请输入项目路径',
            default: defaultPath
          }
        ]
      } else if (args.length === 4) {
        projectInfo.template = args[3].toLowerCase();
        questions = [
          {
            type: 'input',
            name: 'project_name',
            message: '请输入项目名称',
            validate: validateName
          },
          {
            type: 'input',
            name: 'project_path',
            message: '请输入项目路径',
            default: defaultPath
          }
        ]
      } else if (args.length === 5) {
        projectInfo = {
          template: args[3].toLowerCase(),
          name: args[4],
          path: defaultPath
        }
      } else {
        projectInfo = {
          template: args[3],
          name: args[4],
          path: args[5]
        }
      }
    }
    prompt(questions).then(function (answers) {
      if (answers.project_template) {
        projectInfo.template = answers.project_template.toLowerCase();
      }
      if (answers.project_name) {
        projectInfo.name = answers.project_name;
      }
      if (answers.project_path) {
        projectInfo.path = answers.project_path;
      }
      let realPath = path.resolve(process.cwd(), projectInfo.path);
      realPath += sep + projectInfo.name;
      fs.exists(realPath, function (exists) {
        if (!exists) {
          shelljs.exec(`mkdir ${realPath}`);
        }
        try {
          shelljs.cp('-R', `${path.join(__dirname, '.' + sep)}${sep}templates${sep}${projectInfo.template}${sep}*`, `${realPath}`)
          console.log(`${styles.green}`, `\n   模板添加成功`);
        } catch (err) {
          console.log(`${styles.magenta}`, '\n   模板添加失败');
        }
      });
    })
  });

program
  .command('plugins')
  .description('添加插件：zpm plugins [, 插件名]')
  .action(function () {
    let args = process.argv;
    let tul = getAllPlugins();
    if (tul[0].length < 1) {
      console.log(`${styles.magenta}`, '\n  暂时未实现任何插件\n');
      return;
    }
    if (args.length < 4) {
      console.log(`${styles.grey}`, '\n   所有命令如下：');
      console.log(`${styles.grey}`, '\n     - add : 添加插件，可以同时添加多个插件，以空格区分');
      console.log(`${styles.grey}`, '\n             zpm plugins add 插件名 [, 插件名]');
      console.log(`${styles.grey}`, '\n     - list: 显示所有插件');
      console.log(`${styles.grey}`, '\n             zpm plugins list\n');
      // pluginsCommandList();
    } else {
      switch (args[3]) {
        case 'list':
        case 'ls':
          pluginsCommandList({
            allPluginsConfig: tul[2]
          });
          break;
        case 'add':
          pluginsCommandAdd({
            args: args,
            plugins: tul[0],
            pluginsChoice: tul[1]
          });
          break;
        default:
          console.log(`${styles.magenta}`, '\n   命令有误');
          console.log(`${styles.grey}`, '\n   所有命令如下：');
          console.log(`${styles.grey}`, '\n     - add : 添加插件，可以同时添加多个插件，以空格区分');
          console.log(`${styles.grey}`, '\n             zpm plugins add 插件名 [, 插件名]');
          console.log(`${styles.grey}`, '\n     - list: 显示所有插件');
          console.log(`${styles.grey}`, '\n             zpm plugins list\n');
          break;
      }
    }
  });

program.parse(process.argv);

