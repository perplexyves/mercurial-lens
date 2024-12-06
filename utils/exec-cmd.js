const cp = require("child_process");

function executeCommand(command, options) {
  return new Promise((resolve, reject) => {
    cp.exec(command, options, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

module.exports = executeCommand;
