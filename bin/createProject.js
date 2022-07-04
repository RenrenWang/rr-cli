let fs = require("fs");
let chalk = require("chalk");
let inquirer = require("inquirer");
const download = require("download-git-repo");

require("shelljs/global"); // 执行shell脚本

let log = function (txt) {
  console.log(chalk.green.bold(txt));
};
function downloadAsync(name) {
  return new Promise(function (resolve, reject) {
    log(`crate ${name}...`);
    download(`RenrenWang/temple`, name, { clone: false }, (err) => {
      if (err) {
        log(err);
        process.exit(1);
      }
      resolve();
    });
  });
}
async function createProject(name, type) {
  let p = process.cwd(); // 获取当前路径
  cd(p); // shell cd

  // 检测是否存在文件夹， 如果存在，是否需要删除后安装
  if (fs.existsSync(name)) {
    log("project exists, please rename it");
    var questions = [
      {
        type: "confirm",
        name: "isRemoveDir",
        message: `delete ${name} ?`,
        default: false,
      },
    ];

    const answer = await inquirer.prompt(questions).then((answers) => {
      return answers;
    });

    if (!answer.isRemoveDir) {
      process.exit();
    }
    rm("-rf", name); // shell rm
    log(`delete ${name} success`);
  }
  // var questions = [
  //   {
  //     type: "list",
  //     name: "choseTemples",
  //     message: `chose temples ?`,
  //     choices: ["typescript", "javascript"],
  //     default: "javascript",
  //   },
  // ];

  // const answer = await inquirer.prompt(questions).then((answers) => {
  //   return answers;
  // });

  // if (!answer.choseTemples) {
  //   process.exit();
  // }
  await downloadAsync(name);

  cd(name); // shell cd

  log(`安装模块 --- npm`);
  log("安装模块中...");
  log(
    "安装耗时可能会很长，请耐心等待，您也可以通过 ctrl+c停止安装， 手动 npm install"
  );
  exec("npm  install"); // 执行自定义的shell命令 npm install
  log("正在启动项目");
  exec("npm dev"); // 执行自定义的shell命令 npm start
  log("脚手架初始化完成");
  process.exit();
}

module.exports = createProject;
