/**
 * Created by liangshan on 2017/11/25.
 */
const path = require('path');
const fs = require('fs');
const https = require('https');
const shelljs = require('shelljs');
const inquirer = require('inquirer');
const colors = require('colors');
const download = require('download');
const axios = require('axios');
const qs = require('querystring');
const pkg = require('../package.json');

let prompt = inquirer.createPromptModule();

const sep = path.sep;
const pluginSuffix = '.vue';
const requestUrl = 'http://talkapi.dei2.com/';
// const requestUrl = 'http://127.0.0.1:3000/';
https.globalAgent.options.rejectUnauthorized = false;
const request = axios.create({
  baseURL: requestUrl,
  timeout: 3000,
  httpsAgent: new https.Agent({rejectUnauthorized: false}),
  headers: {
    'X-request-from': 'zpm_cli'
  }
});

let BASE_PLUGIN_URL = 'https://static.dei2.com/plugins/';
let BASE_PLUGIN_ZIP_URL = 'https://static.dei2.com/plugins_zips/';

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

const copyText = function () {
  console.log(['                                                                                                           ',
    '                    o                                                             8                        ',
    '                   !888   8                                        88; 88888888888888                      ',
    '                    88888888              8888                      888         $8888                      ',
    '                   8888$        88$8888888888888                     88   88 88 8888                       ',
    '                       888      ;88       8888                       88888888  8888                        ',
    '                        88*8888  888     &888                         88  $8$  888                         ',
    '                     8888&       $88$88888888$                        ;8$88888888!                         ',
    '                88888 88;8888     888                               88888; 88  8     ;$                    ',
    '           88888o    88$  $888    88&                                      8!8888888*8888                  ',
    '           8&       88o     88                                    88888888$8   888   8888                  ',
    '                   88          $88888                         888*88$     8&;888$88  888                   ',
    '                 88       &88 8$  8888                             88  888888     8  888                   ',
    '               ;8          88     $88                              88  88     !88888888                    ',
    '                           888888$$88                               88          888888                     ',
    '                           88     $88                                      8888  8888  8888                ',
    '                           88     $88                           88         8888          8888              ',
    '                           8888888888                         &888    8      888           88              ',
    '                           88     888                         888*     88           88                     ',
    '                                 8888                         888        888888888888888&                  ',
    '                                 888                           88           8888888888888                  ',
    '                                                                                                           '].join('\n'));
  console.log(`\t\t\t\t\t${pkg.name} powered by ${pkg.author.name}`.success);
  console.log(` \t\t\t\t更多内容: ${pkg.author.website}`.data);
}

/**
 * 显示所有脚手架命令
 */
const showAllCommands = function () {
  copyText();
  console.log('\n 所有命令如下'.data);
  console.log(' - init\t\t添加模板'.data);
  console.log(' \t\tzpm init [, project_template] [, project_name] [, project_path]'.data);
  console.log(' - plugins\t添加组件命令'.data);
  console.log(' \t\tzpm plugins add 组件1 [, 组件2]，添加组件，多个组件用空格区分，组件名支持 * （通配符，匹配一个或多个字符）'.data);
  console.log(' \t\t输入zpm plugins help，查看更详细的命令操作'.data);
  console.log(' - sync\t\t同步所有组件'.data);
  console.log(' \t\tzpm sync'.data);
  console.log(' - help, ?\t显示所有命令'.data);
  console.log(' \t\tzpm help 或者 zpm ?\n'.data);
};
const showAllPluginsCommands = function () {
  copyText();
  console.log('\n zpm plugins\t命令所有操作名如下'.data);
  console.log(' - add\t\t添加组件，多个组件以空格区分，支持 * （通配符，匹配一个或多个字符）'.data);
  console.log(' \t\tzpm plugins add [, 组件1] [, 组件1] ...'.data);
  console.log(' - list, ls\t显示所有组件'.data);
  console.log(' \t\tzpm plugins list 或者 zpm plugins ls'.data);
  console.log(' - help, ?\t显示plugins命令的操作名'.data);
  console.log(' \t\tzpm plugins help 或者 zpm plugins ?\n'.data);
};
const showSyncHelp = function () {
  copyText();
  console.log('\n zpm sync\t同步所有已经安装的组件'.data);
  console.log(' - all\t\t同步所有服务端的组件'.data);
  console.log(' \t\tzpm sync all'.data);
  console.log(' - 组件名\t同步指定组件，多个组件以空格分隔'.data);
  console.log(' \t\tzpm sync 组件1 [, 组件2] ...'.data);
  console.log(' - @作者名\t同步指定作者的组件，多个作者以空格分隔，作者名前需要添加@符号'.data);
  console.log(' \t\tzpm sync @作者1 [, @作者2] ...'.data);
  console.log(' \t\t作者名和组件名可以混合使用，作者名前带@符号，组件名前不带@符号: zpm sync @作者1 组件1 @作者2 组件2 ...'.warn);
  console.log(' - help, ?\t显示sync命令的用法'.data);
  console.log(' \t\tzpm sync help 或者 zpm sync ?\n'.data);
};

const showInitHelp = function () {
  copyText();
  console.log('\n zpm init\t添加模板'.data);
  console.log(' \t\tzpm init [, 模板名] [, 项目名] [, 项目路径]'.data);
  console.log(' - help, ?\t显示init命令的用法'.data);
  console.log(' \t\tzpm init help 或者 zpm init ?\n'.data);
};

const showZpmListActionHelp = function () {
  copyText();
  console.log('\n zpm ls, list\t\t查询命令'.data);
  console.log(' - author, authors\t显示所有组件作者'.data);
  console.log('\t\t\tzpm ls [或list] author 或者 zpm ls [或list] authors\n'.data);
  console.log(' - plugin, plugins\t显示所有可用的组件'.data);
  console.log('\t\t\tzpm ls [或list] plugin 或者 zpm ls [或list] plugins\n'.data);
  console.log(' - template, templates\t显示所有可用的模板'.data);
  console.log('\t\t\tzpm ls [或list] template 或者 zpm ls [或list] template\n'.data);
  console.log(' - help, ?\t\t显示init命令的用法'.data);
  console.log('\t\t\tzpm ls [或list] help 或者 zpm ls [或list] ?\n'.data);
};

/**
 * 本地未安装组件的提示
 */
const showNoPluginsTip = function () {
  copyText();
  console.log('\n WARN '.warnTag, '本地未安装任何组件'.warn);
  console.log('\n       您还可以: '.data);
  console.log('\n       输入 "zpm sync all" 同步所有可用的组件'.data);
  console.log('\n       输入 "zpm sync 组件1 [, 组件2]" 同步指定的组件，多个组件用空格区分'.data);
  console.log('\n       输入 "zpm sync @作者1 [, @作者2]" 同步指定作者的组件，多个作者用空格区分，作者名前带@符号'.data);
  console.log('\n       输入 "zpm sync @作者1 组件1 [, @作者2, 组件2]" 同步指定作者的组件，多个作者用空格区分，作者名前带@符号，组件名前不带@符号\n'.data);
};

const getAllPlugins = function () {
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
          // 存在index.vue，则认为是有效的组件
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
  copyText();
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

/**
 * 获取html版 版权注释
 * @param pkg
 * @returns {string}
 * @private
 */
const _getHtmlCopyRight = function (pkg) {
  copyText();
  let _replacement = '<!--\n' +
    `\tPowered by ${pkg.name}, Ver ${pkg.version}\n` +
    `\tDescription: ${pkg.description}\n` +
    `\tCreated by ${pkg.author.name}`
  if (pkg.date) {
    _replacement += `, on ${pkg.date}\n`
  } else {
    _replacement += '\n'
  }
  _replacement += `\tEmail to: ${pkg.author.email}\n`
  if (pkg.slogan) {
    _replacement += `\tSlogan: ${pkg.slogan || ''}\n` + '-->'
  } else {
    _replacement += '-->'
  }
  return _replacement
}
/**
 * 获取JS版 版权注释
 * @param pkg
 * @returns {string}
 * @private
 */
const _getJsCopyRight = function (pkg) {
  copyText();
  let _replacement = '  /**\n' +
    `   * Powered by ${pkg.name}, Ver ${pkg.version}\n` +
    `   * Description: ${pkg.description}\n` +
    `   * Created by ${pkg.author.name}`
  if (pkg.date) {
    _replacement += `, on ${pkg.date}\n`
  } else {
    _replacement += '\n'
  }
  _replacement += `   * Email to: ${pkg.author.email}\n`
  if (pkg.slogan) {
    _replacement += `   * Slogan: ${pkg.slogan || ''}\n` + '   */'
  } else {
    _replacement += '   */'
  }
  return _replacement
}

const getCopyRightText = function (pkg, type) {
  let _replacement = ''
  switch (type) {
    case 'html':
      _replacement = _getHtmlCopyRight(pkg)
      break
    case 'js':
      _replacement = _getJsCopyRight(pkg)
      break
    case 'css':
      break
    default:
      _replacement = _getHtmlCopyRight(pkg)
      break
  }
  return _replacement
}

const pluginsCommandAdd = function (opts) {
  let questions = [];
  let pluginInfo = {
    plugins: []
  };
  // 所有组件
  let plugins = opts.plugins;
  // 待安装的组件列表
  let newPlugins = opts.args.slice(4);
  // 不存在的组件
  let illegalPlugins = [];
  // 存在的组件
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
    // 无合法的组件
    questions = [
      {
        type: 'checkbox',
        name: 'plugins',
        message: '请选择待安装的组件',
        choices: opts.pluginsChoice
      }
    ]
  } else {

  }
  if (illegalPlugins.length > 0) {
    // 不正确的组件名
    console.log('\n FAIL '.errorTag, `组件 ${illegalPlugins.join('、')} 不存在！\n`.error);
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
          let pkg = require(`${path.join(__dirname, '.' + sep)}/plugins${sep}${plugin}${sep}package.json`)
          let _htmlReplacement = getCopyRightText(pkg, 'html')
          let _jsReplacement = getCopyRightText(pkg, 'js')
          replaceFileContent(/<template>/, _htmlReplacement + '\n<template>', `${realPath}${sep}${plugin}.vue`)
          replaceFileContent(/<script>/, '<script>\n' + _jsReplacement, `${realPath}${sep}${plugin}.vue`)
          successInstalled.push(plugin);
        } catch (err) {
          failInstalled.push(plugin);
        }
      });
      if (successInstalled.length > 0) {
        console.log('\n DONE '.successTag, '组件'.success, `${successInstalled.join('、')}`.success.bold.italic, '添加成功\n'.success);

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
          // if (txt.indexOf('from \'vue\'') < 0 && txt.indexOf('from "vue"') < 0) {
          //   // 没有vue，导入vue
          //   txt = 'import Vue from \'vue\'\n' + txt
          // }
          (txt !== bytesRead) && fs.writeFileSync(indexPath, txt)
        })
      }
      if (failInstalled.length > 0) {
        console.log('\n FAIL '.errorTag, `组件 ${failInstalled.join('、')} 添加失败\n`.error);
      }
    });
  });
};

/**
 * 同步所有可用的组件
 * @param callback
 */
const syncPlugins = function (callback) {
  download('https://codeload.github.com/lsliangshan/zpm_plugins/zip/master', `${path.resolve(__dirname, '..' + sep)}`, {
    extract: true
  }).then(() => {
    let pluginPath = path.resolve(__dirname, `.${sep}plugins`);
    !fs.existsSync(pluginPath) && fs.mkdirSync(pluginPath)
    try {
      shelljs.cp('-R', path.resolve(__dirname, `..${sep}zpm_plugins-master${sep}plugins${sep}*`), pluginPath);
      setTimeout(() => {
        console.log('\n DONE '.successTag, '组件同步成功'.success);
        let stats = fs.readdirSync(path.resolve(__dirname, `..${sep}zpm_plugins-master${sep}plugins`));
        if (stats) {
          if (stats.length > 0) {
            console.log('\n 同步的组件有'.grey);
            console.log(` ${stats.join('\n ')}`.info);
            console.log(' ');
            callback && callback();
          } else {
            console.log('\n WARN '.warnTag, '未找到任何组件'.warn);
          }
        }
      }, 200)
    } catch (err) {
      console.log('\n FAIL '.errorTag, `组件同步失败${err}`.error);
    }
  }).catch((err) => {
    console.log('\n FAIL '.errorTag, '同步组件失败，请重试'.error);
  })
};

const syncAllPluginsFromDei2 = async function syncAllPlugins (args) {
  let _searchConditions = {};
  if (args && args.users && args.users.length > 0) {
    _searchConditions.username = args.users.join(';');
  }
  let pluginsData = await request.post('/Zpm/cli/listPlugins', qs.stringify(_searchConditions));
  if (Number(pluginsData.data.status) === 200) {
    let _allPlugins = pluginsData.data.data.plugins;
    let i = 0;
    let failedPlugins = [];
    let successfulPlugins = [];
    for (i; i < _allPlugins.length; i++) {
      let downloadedPluginData = await syncOnePluginFromDei2(_allPlugins[i].name)
      if (downloadedPluginData === '') {
        failedPlugins.push(_allPlugins[i].name);
      } else {
        successfulPlugins.push(downloadedPluginData);
      }
    }
    if (failedPlugins.length > 0) {
      console.log(`\n 组件 ${failedPlugins.join(' 、 ')} 同步失败\n`.warn);
    }
    if (successfulPlugins.length > 0) {
      console.log(`\n 组件 ${successfulPlugins.join(' 、 ')} 同步成功\n`.success);
    }
  }
};

const syncPluginsFromDei2 = async function syncPluginsFromDei2 (args) {
  let _allPlugins = args.plugins.split(';');
  let i = 0;
  let failedPlugins = [];
  let successfulPlugins = [];
  for (i; i < _allPlugins.length; i++) {
    let downloadedPluginData = await syncOnePluginFromDei2(_allPlugins[i]);
    if (downloadedPluginData === '') {
      failedPlugins.push(_allPlugins[i]);
    } else {
      successfulPlugins.push(downloadedPluginData);
    }
  }
  if (failedPlugins.length > 0) {
    console.log(`\n 组件 ${failedPlugins.join(' 、 ')} 同步失败\n`.warn);
  }
  if (successfulPlugins.length > 0) {
    console.log(`\n 组件 ${successfulPlugins.join(' 、 ')} 同步成功\n`.success);
  }
};

const syncOnePluginFromDei2 = function syncOnePluginFromDei2 (pluginName) {
  let pluginsPath = path.resolve(__dirname, '.' + sep + 'plugins');
  if (!fs.existsSync(pluginsPath)) {
    fs.mkdirSync(pluginsPath);
  }
  return new Promise((resolve, reject) => {
    download(`${BASE_PLUGIN_ZIP_URL}/${pluginName}.zip`, pluginsPath, {
      extract: true
    }).then((res) => {
        resolve(pluginName);
      }).catch(err => {
        resolve('');
    });
  });
};

const getPluginsByUser = async function getPluginsByUser (args) {
  if (!args || !args.username || args.username.trim() === '') {
    return [];
  }
  let pluginsData = await request.post('/Zpm/cli/getPluginsByUser', qs.stringify({
    username: args.username
  }));
  if (Number(pluginsData.data.status) === 200) {
    return pluginsData.data.data.plugins;
  } else {
    return [];
  }
};

const syncPluginsByUsersOrPluginNamesFromDei2 = async function syncPluginsByUsersOrPluginNamesFromDei2 (args) {
  let plugins = [];
  let i = 0;
  let _users = [];
  for (i; i < args.params.length; i++) {
    if (args.params[i].match(/^@+/)) {
      _users.push(args.params[i].replace(/^@+/, ''));
    } else {
      plugins.push(args.params[i]);
    }
  }
  let _pluginsFromUsers = await getPluginsByUser({
    username: _users.join(';')
  });
  plugins = plugins.concat(_pluginsFromUsers);
  let j = 0;
  let failedPlugins = [];
  let successfulPlugins = [];
  for (j; j < plugins.length; j++) {
    let downloadedPluginData = await syncOnePluginFromDei2(plugins[j])
    if (downloadedPluginData === '') {
      failedPlugins.push(plugins[j]);
    } else {
      successfulPlugins.push(downloadedPluginData);
    }
  }
  if (failedPlugins.length > 0) {
    console.log(`\n 组件 ${failedPlugins.join(' 、 ')} 同步失败\n`.warn);
  }
  if (successfulPlugins.length > 0) {
    console.log(`\n 组件 ${successfulPlugins.join(' 、 ')} 同步成功\n`.success);
  }
};

const syncOnePlugin = function (plugin) {
  let pluginsRoot = path.resolve(__dirname, '.' + sep + 'plugins')
  !fs.existsSync(pluginsRoot) && fs.mkdirSync(pluginsRoot)
  let pluginPath = path.resolve(__dirname, '.' + sep + 'plugins' + sep + plugin)
  !fs.existsSync(pluginPath) && fs.mkdirSync(pluginPath)

  let downVuePromise = new Promise((resolve, reject) => {
    download(`https://raw.githubusercontent.com/lsliangshan/zpm_plugins/master/plugins/${plugin}/index.vue`, pluginPath, {}).then(() => {
      resolve(plugin)
    }).catch((err) => {
      let vuePath = path.resolve(__dirname, '.' + sep + 'plugins' + sep + plugin + sep + 'index.vue')
      fs.existsSync(vuePath) && fs.unlinkSync(vuePath)
      let pkgPath = path.resolve(__dirname, '.' + sep + 'plugins' + sep + plugin + sep + 'package.json')
      fs.existsSync(pkgPath) && fs.unlinkSync(pkgPath)
      fs.existsSync(pluginPath) && fs.rmdirSync(pluginPath)
      reject(err)
    })
  })
  let downPkgPromise = new Promise((resolve, reject) => {
    download(`https://raw.githubusercontent.com/lsliangshan/zpm_plugins/master/plugins/${plugin}/package.json`, pluginPath, {}).then(() => {
      resolve(plugin)
    }).catch((err) => {
      // reject(err)
      resolve(err)
    })
  })
  Promise.all([downPkgPromise, downVuePromise]).then(function (res) {
    console.log(' DONE '.successTag, '组件', `${plugin}`.bold.italic, '同步成功\n');
  }).catch((err) => {
    switch (err.statusCode) {
      case 404:
        console.log(' FAIL '.errorTag, '组件', `${plugin}`.bold.italic, '不存在\n');
        break;
      default:
        console.log(' FAIL '.errorTag, '组件', `${plugin}`.bold.italic, `同步失败: ${err.statusMessage}\n`);
        break;
    }
  })
};

/**
 * 文件内容替换
 * @param substr, [必需] 规定子字符串或要替换的模式的 RegExp 对象。请注意，如果该值是一个字符串，则会被转换为 RegExp 对象。
 * @param replacement, [必需] 一个字符串值。规定了替换文本或生成替换文本的函数。
 * @param filename, [必需] 待替换文件的真实全路径（path + filename + file_suffix）
 * @param replaceAttributes, [可选] 当 substr 为字符串类型时有效，包含属性 "g"、"i" 和 "m"，分别用于指定全局匹配、区分大小写的匹配和多行匹配。
 */
const replaceFileContent = function (substr, replacement, filename, replaceAttributes) {
  let fsContent = fs.readFileSync(filename, {encoding: 'utf-8'})
  let txt = fsContent || ''
  let _replaceReg = substr
  if (Object.prototype.toString.call(_replaceReg) !== '[object RegExp]') {
    _replaceReg = new RegExp(_replaceReg, replaceAttributes ? replaceAttributes : '')
  }
  txt = txt.replace(_replaceReg, replacement)
  if (txt !== fsContent) {
    fs.writeFileSync(filename, txt)
  }
};

const _listAuthors = async function _listAuthors () {
    let users = [];
    try {
      let usersData = await request.post('Zpm/cli/listUsers', {});
      if (Number(usersData.data.status) === 200) {
        users = usersData.data.data.users;
      } else {
        users = [];
      }
    } catch (err) {
      users = [];
    }
    copyText();
    if (users.length < 1) {
      console.log('\n   无注册的开发者，您可以访问 http://plugins.admin.dei2.com 注册开发者并提交组件。'.data);
    } else {
      console.log(`\n 共${users.length}位已注册的开发者:`.data);
      console.log(`   ${users.join(' 、 ')}`.warn);
    }
    return users;
};

const _listPlugins = async function _listPlugins (args) {
    let queryUsers = args.users;
    for (let u = 0; u < queryUsers.length; u++) {
      if (queryUsers[u].match(/^@.+/)) {
        queryUsers[u] = queryUsers[u].replace(/^@+/, '');
      } else {
        queryUsers.splice(u, 1);
        u--;
      }
    }
    let _searchConditions = {};
    if (queryUsers.length > 0) {
      _searchConditions.username = queryUsers.join(';');
    }
    let plugins = [];
    try {
      let pluginsData = await request.post('Zpm/cli/listPlugins', qs.stringify(_searchConditions));
      if (Number(pluginsData.data.status) === 200) {
        plugins = pluginsData.data.data.plugins;
      } else {
        plugins = [];
      }
    } catch (err) {
      plugins = [];
    }
    copyText();
    if (plugins.length < 1) {
      console.log('\n   无可用的组件，您可以访问 http://plugins.admin.dei2.com 注册开发者并提交组件。'.data);
    } else {
      console.log(' ');
      for (let i = 0; i < plugins.length; i++) {
        console.log(`- ${plugins[i].name}  `.cyan);
        console.log(`    Author   ${plugins[i].author.username} ${plugins[i].author.phonenum}`.data);
      }
      console.log(' ');
    }
};

const _listTemplates = function () {
    copyText();
    console.log('\n可用的模板：default 、 vuex'.warn);
    console.log('\tdefault模板：普通模板，只包含基本的vue环境，默认不支持vuex。zpm init default 项目名'.data);
    console.log('\tvuex模板：vuex模板，支持vuex。zpm init vuex 项目名'.data);
};

const zpmListAction = async function () {
    let args = process.argv;
    let _listType = args.slice(3)[0];
    switch (_listType) {
        case 'author':
        case 'authors':
          await _listAuthors();
          break;
        case 'plugin':
        case 'plugins':
          await _listPlugins({
              users: process.argv.slice(4)
          });
          break;
        case 'template':
        case 'templates':
          _listTemplates();
          break;
        case 'help':
        case '?':
        case '？':
          showZpmListActionHelp();
          break;
        default:
          showZpmListActionHelp();
          break;
    }
};

const zpmSyncAction = async function zpmSyncAction () {
  let args = process.argv;
  let params = args.slice(3);
  if (params.length === 0) {
    // 同步已经安装的插件
    let newPlugins = this.getAllPlugins()[0];
    if (newPlugins.length === 0) {
      showNoPluginsTip();
    } else {
      await syncPluginsFromDei2({
        plugins: newPlugins.join(';')
      });
    }
  } else {
    let syncType = params[0];
    switch (syncType) {
      case 'all':
        await syncAllPluginsFromDei2();
        break;
      case 'help':
      case '?':
      case '？':
        this.showSyncHelp();
        break;
      default:
        await syncPluginsByUsersOrPluginNamesFromDei2({
          params: args.slice(3)
        });
        break;
    }
  }
};

module.exports = {
  validateName: validateName,
  isEmptyObj: isEmptyObj,
  showAllCommands: showAllCommands,
  showAllPluginsCommands: showAllPluginsCommands,
  showSyncHelp: showSyncHelp,
  showInitHelp: showInitHelp,
  showNoPluginsTip: showNoPluginsTip,
  getAllPlugins: getAllPlugins,
  pluginsCommandList: pluginsCommandList,
  pluginsCommandAdd: pluginsCommandAdd,
  syncPlugins: syncPlugins,
  syncOnePlugin: syncOnePlugin,
  replaceFileContent: replaceFileContent,
    zpmListAction: zpmListAction,
  zpmSyncAction: zpmSyncAction
};
