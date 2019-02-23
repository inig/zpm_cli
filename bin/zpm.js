#!/usr/bin/env node
/**
 * Created by liangshan on 2017/11/16.
 */

'use strict'
const path = require('path')
const fs = require('fs')
const shelljs = require('shelljs')
const program = require('commander')
const inquirer = require('inquirer')
const pkg = require('../package.json')
const colors = require('colors')
// const download = require('download')
const lib = require('./lib.js')
// let prompt = inquirer.createPromptModule()

const sep = path.sep

colors.setTheme({
  help: 'cyan',
  debug: 'blue',
  data: 'grey',
  warnTag: ['white', 'bgYellow'],
  warn: 'yellow',
  errorTag: ['white', 'bgRed'],
  error: 'red',
  infoTag: ['white', 'bgGreen'],
  info: 'green',
  successTag: ['white', 'bgGreen'],
  success: 'green'
})

program.version(`${pkg.version}`)

function afterAnswers (projectInfo, templateReplacement = { url: '' }) {
  let realPath = path.resolve(process.cwd(), projectInfo.path)
  realPath += sep + projectInfo.name
  let globalVarName = ''
  if (projectInfo.template === 'vuex' || projectInfo.template.indexOf('weex') === 0) {
    globalVarName = projectInfo.name.replace(/(\..)*/g, function (item) {
      return item.charAt(1).toUpperCase()
    })
  }
  fs.exists(realPath, function (exists) {
    if (!exists) {
      shelljs.exec(`mkdir ${realPath}`)
    }
    try {
      shelljs.cp(
        '-R',
        `${path.join(__dirname, '.' + sep)}templates${sep}${
        projectInfo.template
        }${sep}*`,
        `${realPath}`
      )
      shelljs.cp(
        '-R',
        `${path.join(__dirname, '.' + sep)}templates${sep}${
        projectInfo.template
        }${sep}.*`,
        `${realPath}`
      )
      if (globalVarName !== '') {
        let indexPath = path.resolve(realPath, 'index.js')
        let storeIndexPath = path.resolve(realPath, 'store/index.js')
        lib.replaceFileContent(/\$\$APP_NAME\$\$/g, globalVarName, indexPath)
        lib.replaceFileContent(/\$\$APP_NAME\$\$/g, globalVarName, storeIndexPath)
        try {
          let homeVuePath = path.resolve(realPath, 'components/Home.vue')
          lib.replaceFileContent(/\$\$APP_NAME\$\$/g, globalVarName, homeVuePath)
        } catch (err) { }
      }
      if (templateReplacement.url.trim() !== '') {
        let replacementFilePath = path.resolve(realPath, templateReplacement.url.trim())
        for (let k in templateReplacement.data) {
          if (templateReplacement.data.hasOwnProperty(k)) {
            lib.replaceFileContent(new RegExp(templateReplacement.data[k].replace(/\$/g, '\\\$'), 'g'), projectInfo[k], replacementFilePath)
          }
        }
      }
      console.log(
        '\n DONE '.successTag,
        '模板'.success,
        `${projectInfo.template}`.success.bold.italic,
        '添加成功\n'.success
      )
      if (projectInfo.template.match(/^enkel\-/)) {
        console.log(` cd ${projectInfo.name}`.data)
        console.log(` npm install`.data)
        console.log(` npm run dev\n`.data)
      }
    } catch (err) {
      console.log(
        '\n FAIL '.errorTag,
        `模板 ${projectInfo.template} 添加失败\n`.error
      )
    }
  })
}

function templateWeexPositions (projectInfo) {
  let additionalQuestions = [
    {
      type: 'input',
      name: 'template_title',
      message: '项目标题',
      default: ''
    },
    {
      type: 'input',
      name: 'template_hd_bg',
      message: '头图背景',
      default: ''
    },
    {
      type: 'input',
      name: 'template_hd_ct',
      message: '头图',
      default: ''
    }
  ]
  inquirer.prompt(additionalQuestions).then(answers => {
    let templateReplacement = {
      url: 'components/Home.vue',
      data: {
        template_title: '$$TEMPLATE_TITLE$$',
        template_hd_bg: '$$TEMPLATE_HD_BG$$',
        template_hd_ct: '$$TEMPLATE_HD_CT$$'
      }
    }
    if (answers.template_title) {
      projectInfo.template_title = answers.template_title
    }
    if (answers.template_hd_bg) {
      projectInfo.template_hd_bg = answers.template_hd_bg
    }
    if (answers.template_hd_ct) {
      projectInfo.template_hd_ct = answers.template_hd_ct
    }
    afterAnswers(projectInfo, templateReplacement)
  })
}

program
  .command('init')
  .description(
    '初始化项目: zpm init [, project_template] [, project_name] [, project_path]'
  )
  .action(function () {
    let defaultPath = `.${sep}`
    let questions = []
    let projectInfo = {
      template: 'default',
      name: '',
      path: defaultPath
    }

    let allTemplates = []
    let templateChoices = []
    let templatesPath = path.resolve(__dirname, `.${sep}templates`)
    let filenames = fs.readdirSync(templatesPath)

    filenames.forEach(function (fname) {
      let _realFilePath = path.join(templatesPath, fname)
      let _stat = fs.statSync(_realFilePath)
      if (_stat.isDirectory()) {
        allTemplates.push(fname)
        templateChoices.push({
          name: fname,
          value: fname
        })
      }
    })

    let args = process.argv
    if (args.length === 4 && ['help', '?', '？'].indexOf(args[3]) > -1) {
      lib.showInitHelp(true)
      return
    }
    if (allTemplates.indexOf(args[3]) < 0 && args.length > 3) {
      console.log('\n FAIL '.errorTag, `模板 ${args[3]} 不存在\n`.error)
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
          validate: lib.validateName
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
            validate: lib.validateName
          },
          {
            type: 'input',
            name: 'project_path',
            message: '请输入项目路径',
            default: defaultPath
          }
        ]
      } else if (args.length === 4) {
        projectInfo.template = args[3].toLowerCase()
        questions = [
          {
            type: 'input',
            name: 'project_name',
            message: '请输入项目名称',
            validate: lib.validateName
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
    inquirer.prompt(questions).then(function (answers) {
      if (answers.project_template) {
        projectInfo.template = answers.project_template.toLowerCase()
      }
      if (answers.project_name) {
        projectInfo.name = answers.project_name
      }
      if (answers.project_path) {
        projectInfo.path = answers.project_path
      }
      if (answers.project_template === 'weex-positions') {
        templateWeexPositions(projectInfo)
      } else {
        afterAnswers(projectInfo)
      }
    })
  })

program
  .command('plugins')
  .description('添加组件：zpm plugins [, 操作名] [, 组件名]')
  .action(function () {
    let args = process.argv
    let tul = lib.getAllPlugins()
    if (args.length < 4) {
      console.log('\n 请输入操作名'.error)
      lib.showAllPluginsCommands(true)
    } else {
      switch (args[3]) {
        case 'list':
        case 'ls':
          if (tul[0].length < 1) {
            lib.showNoPluginsTip(true)
            return
          }
          lib.pluginsCommandList({
            allPluginsConfig: tul[2]
          })
          break
        case 'add':
          lib.pluginsCommandAdd({
            args: args,
            plugins: tul[0],
            pluginsChoice: tul[1]
          })
          break
        case 'help':
        case '?':
        case '？':
          lib.showAllPluginsCommands(true)
          break
        default:
          console.log('\n FAIL '.errorTag, '命令操作名有误'.error)
          lib.showAllPluginsCommands(true)
          break
      }
    }
  })

program.command('sync').action(function () {
  lib.zpmSyncAction()
  // let args = process.argv;
  // // 待安装的组件
  // let newPlugins = args.slice(3);
  // if (newPlugins.length === 0) {
  //   // 同步所有已经安装的组件
  //   console.log(' ')
  //   newPlugins = lib.getAllPlugins()[0];
  //   if (newPlugins.length === 0) {
  //     // 还未安装过组件
  //     lib.showNoPluginsTip();
  //   } else {
  //     newPlugins.forEach(function (plugin) {
  //       lib.syncOnePlugin(plugin)
  //     });
  //   }
  // } else if (newPlugins.length === 1) {
  //   switch (newPlugins[0]) {
  //     case 'all':
  //       // 同步所有服务端的组件
  //       lib.syncPlugins();
  //       break;
  //     case 'help':
  //     case '?':
  //     case '？':
  //       // 显示命令帮助
  //       lib.showSyncHelp();
  //       break;
  //     default:
  //       // 同步指定组件
  //       console.log(' ')
  //       newPlugins.forEach(function (plugin) {
  //         lib.syncOnePlugin(plugin)
  //       });
  //       break;
  //   }
  // } else {
  //   // 同步指定组件
  //   console.log(' ')
  //   newPlugins.forEach(function (plugin) {
  //     lib.syncOnePlugin(plugin)
  //   });
  // }
})

program.command('ls').action(function () {
  lib.zpmListAction()
})

program.command('list').action(function () {
  lib.zpmListAction()
})

program.command('help').action(function () {
  lib.showAllCommands(true)
})
program.command('?').action(function () {
  lib.showAllCommands(true)
})
program.command('？').action(function () {
  lib.showAllCommands(true)
})

program.command('whoami').action(function () {
  lib.copyText()
})

program.parse(process.argv)
