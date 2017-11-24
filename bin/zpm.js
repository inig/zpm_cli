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
const colors = require('colors');
const download = require('download');
let prompt = inquirer.createPromptModule();

const pluginSuffix = '.vue';

colors.setTheme({
  help: 'cyan',
  debug: 'blue',
  data: 'grey',
  warnTag: ['black', 'bgYellow', 'bold'],
  warn: 'yellow',
  errorTag: ['black', 'bgRed'],
  error: 'red',
  infoTag: ['black', 'bgGreen'],
  info: 'green',
  successTag: ['black', 'bgGreen'],
  success: 'green'
});

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

/**
 * 显示所有脚手架命令
 */
const showAllCommands = function () {
  console.log('\n 所有命令如下'.data);
  console.log(' - init        添加模板'.data);
  console.log('               zpm init [, project_template] [, project_name] [, project_path]'.data);
  console.log(' - list, ls    显示所有命令'.data);
  console.log('               zpm list'.data);
  console.log(' - sync        同步所有插件'.data);
  console.log('               zpm sync\n'.data);
};
const showAllPluginsCommands = function () {
  console.log('\n 所有命令如下'.data);
  console.log(' - add         添加插件，可以同时添加多个插件，以空格区分'.data);
  console.log('               zpm plugins add [, 插件名]'.data);
  console.log(' - list, ls    显示所有插件'.data);
  console.log('               zpm plugins list\n'.data);
};

const getAllPlugins = function () {
  const sep = path.sep;
  let templatesPath = path.resolve(__dirname, `.${sep}plugins`);
  let allPlugins = [];
  let allPluginsConfig = [];
  let pluginChoice = [];
  let exists = fs.existsSync(templatesPath);
  if (exists) {
    let filenames = fs.readdirSync(templatesPath);
    filenames.forEach(function (fname) {
      let _realFilePath = path.join(templatesPath, fname);
      let _stat = fs.statSync(_realFilePath);
      if (_stat.isDirectory()) {
        let _realFiles = fs.readdirSync(_realFilePath);
        if (_realFiles.indexOf(`index${pluginSuffix}`) > -1) {
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
  }
  return [allPlugins, pluginChoice, allPluginsConfig];
};

const pluginsCommandList = function (opts) {
  let allPluginsConfig = opts.allPluginsConfig;
  for (let i = 0; i < allPluginsConfig.length; i++) {
    if (i === 0) { console.log(' '); }

    if (isEmptyObj(allPluginsConfig[i].value)) {
      console.log(`- ${allPluginsConfig[i].name}`.cyan);
    } else {
      console.log(`- ${allPluginsConfig[i].name}  `.cyan, `${allPluginsConfig[i].value.description}`);
      console.log(`    Author   ${allPluginsConfig[i].value.author.name} (${allPluginsConfig[i].value.author.email})`.data);
      console.log(`    Latest   v${allPluginsConfig[i].value.version}`.data);
    }

    if (i === allPluginsConfig.length - 1) { console.log(' '); }
  }
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
    if (p.indexOf('*') < 0) {
      // 不存在通配符
      if (plugins.indexOf(p) < 0) {
        illegalPlugins.push(p);
      } else {
        (legalPlugins.indexOf(p) < 0) && legalPlugins.push(p);
      }
    } else {
      // 存在通配符
      let outPlugins = []
      plugins.forEach(function (plugin) {
        let regStr = new RegExp('^' + p.replace(/(\*)/g, '.*') + '$' )
        if (plugin.match(regStr)) {
          if (outPlugins.indexOf(plugin) < 0 && legalPlugins.indexOf(plugin) < 0) {
            outPlugins.push(plugin)
          }
        }
      })
      legalPlugins = legalPlugins.concat(outPlugins)
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
    console.log('\n ERROR '.errorTag, `插件 ${illegalPlugins.join('、')} 不存在！\n`.error);
  }
  prompt(questions).then(function (answers) {
    if (answers.plugins) {
      pluginInfo.plugins = answers.plugins;
      legalPlugins = answers.plugins;
    }
    let realPath = path.resolve(process.cwd(), `.${sep}plugins`);
    fs.exists(realPath, function (exists) {
      if (!exists) {
        shelljs.exec(`mkdir ${realPath}`);
      }
      let successInstalled = [];
      let failInstalled = [];
      legalPlugins.forEach(function (plugin) {
        try {
          shelljs.cp('-R', `${path.join(__dirname, '.' + sep)}/plugins${sep}${plugin}${sep}index${pluginSuffix}`, `${realPath}${sep}${plugin}.vue`);
          successInstalled.push(plugin);
        } catch (err) {
          failInstalled.push(plugin);
        }
      });
      if (successInstalled.length > 0) {
        console.log('\n DONE '.successTag, '插件'.success, `${successInstalled.join('、')}`.success.bold.italic, '添加成功\n'.success);

        // 导入并全局注册所有.vue组件
        let indexPath = path.resolve(process.cwd(), `.${sep}plugins${sep}index.js`)
        let txt = ''
        fs.readFile(indexPath, {encoding: 'utf-8'}, (err, bytesRead) => {
          txt = bytesRead || ''
          for (let i = 0; i < successInstalled.length; i++) {
            let comName = successInstalled[i]
              .replace(/^([A-Z])/, function ($1) { return $1.toLowerCase() })
              .replace(/([A-Z])/g, function ($1) { return '-' + $1.toLowerCase() })
            if (txt === '') {
              txt = `import ${successInstalled[i]} from './${successInstalled[i]}.vue'\n` + txt
              txt += `Vue.component('${comName}', ${successInstalled[i]})\n`
            } else {
              if (txt.indexOf(successInstalled[i]) < 0) {
                txt = `import ${successInstalled[i]} from './${successInstalled[i]}.vue'\n` + txt
                txt += `Vue.component('${comName}', ${successInstalled[i]})\n`
              }
            }
          }
          if (txt.indexOf('from \'vue\'') < 0 && txt.indexOf('from "vue"') < 0) {
            // 没有vue，导入vue
            txt = 'import Vue from \'vue\'\n' + txt
          }
          (txt !== bytesRead) && fs.writeFileSync(indexPath, txt)
        })
      }
      if (failInstalled.length > 0) {
        console.log('\n ERROR '.errorTag, `插件 ${failInstalled.join('、')} 添加失败\n`.error);
      }
    });
  });
};

/**
 * 同步所有可用的插件
 * @param callback
 */
const syncPlugins = function (callback) {
  const sep = path.sep
  download('https://codeload.github.com/lsliangshan/zpm_plugins/zip/master', `${path.resolve(__dirname, '..' + sep)}`, {
    extract: true
  }).then(() => {
    let pluginPath = path.resolve(__dirname, `.${sep}plugins`);
    fs.exists(pluginPath, function (exists) {
      if (!exists) {
        shelljs.exec(`mkdir ${pluginPath}`);
      }
      try {
        shelljs.cp('-R', path.resolve(__dirname, `..${sep}zpm_plugins-master${sep}plugins${sep}*`), pluginPath);
        setTimeout(() => {
          console.log('\n DONE '.successTag, '插件同步成功'.success);
          let stats = fs.readdirSync(path.resolve(__dirname, `..${sep}zpm_plugins-master${sep}plugins`));
          if (stats) {
            if (stats.length > 0) {
              console.log('\n 同步的插件有'.grey);
              console.log(` ${stats.join('\n')}`.info);
              console.log(' ');
              callback && callback();
            } else {
              console.log('\n WARN '.warnTag, '未找到任何插件'.warn);
            }
          }
        }, 200)
      } catch (err) {
        console.log('\n ERROR '.errorTag, `插件同步失败${err}`.error);
      }
    });
  }).catch((err) => {
    console.log('\n ERROR '.errorTag, '同步插件失败，请重试'.error);
  })
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
      console.log('\n ERROR '.errorTag, `模板 ${args[3]} 不存在\n`.error);
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
          shelljs.cp('-R', `${path.join(__dirname, '.' + sep)}/templates${sep}${projectInfo.template}${sep}*`, `${realPath}`)
          console.log('\n DONE '.successTag, '模板'.success, `${projectInfo.template}`.success.bold.italic, '添加成功\n'.success);
        } catch (err) {
          console.log('\n ERROR '.errorTag, `模板 ${projectInfo.template} 添加失败\n`.error);
        }
      });
    })
  });

program
  .command('plugins')
  .description('添加插件：zpm plugins [, 操作名] [, 插件名]')
  .action(function () {
    let args = process.argv;
    let tul = getAllPlugins();
    if (tul[0].length < 1) {
      console.log('\n WARN '.warnTag, '未找到任何插件'.warn);
      console.log('\n 输入 "zpm sync" 同步所有可用的插件\n'.data);
      return;
    }
    if (args.length < 4) {
      showAllCommands();
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
          console.log('\n ERROR '.errorTag, '命令有误'.error);
          showAllPluginsCommands();
          break;
      }
    }
  });

program
  .command('sync')
  .action(function () {
    syncPlugins();
  });

program
  .command('list')
  .action(function () {
    showAllCommands();
  });
program
  .command('ls')
  .action(function () {
    showAllCommands();
  });

program.parse(process.argv);

