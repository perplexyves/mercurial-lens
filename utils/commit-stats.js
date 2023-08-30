const executeCommand = require("./exec-cmd");

function getCommitInfo(changeset, parentDirectory, info) {
  return executeCommand(`hg log -r ${changeset} --template "{${info}}"`, {
    cwd: parentDirectory,
  });
}

function getCommitStats(changeset, parentDirectory) {

  const authorNamePromise = getCommitInfo(changeset, parentDirectory, "author|person");
  const authorEmailPromise = getCommitInfo(changeset, parentDirectory, "author|email");
  const branchPromise = getCommitInfo(changeset, parentDirectory, "branch");
  const datePromise = getCommitInfo(changeset, parentDirectory, "date|isodate");
  const commitMsgPromise = getCommitInfo(changeset, parentDirectory, "desc");

  return {
    authorNamePromise,
    authorEmailPromise,
    branchPromise,
    datePromise,
    commitMsgPromise,
  };
}

module.exports = getCommitStats;
