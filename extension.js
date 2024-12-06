// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const getCommitStats = require("./utils/commit-stats");
const executeCommand = require("./utils/exec-cmd");
const timeAgo = require("./utils/time-ago");

function activate() {
  let decoration;
  let hover;
  let decorationTimeout;

  vscode.window.onDidChangeTextEditorSelection((event) => {
    const activeEditor = event.textEditor;
    const editorPath = activeEditor.document.uri.fsPath;
    const parentDirectory = editorPath.startsWith("/")
      ? editorPath.split("/").slice(0, -1).join("/")
      : editorPath.split("\\").slice(0, -1).join("\\");

    // console.log("parentDirectory", parentDirectory);

    if (decorationTimeout) {
      clearTimeout(decorationTimeout);
    }

    if (decoration) decoration.dispose();
    if (hover) hover.dispose();

    const cursorPosition = activeEditor.selection.active;

    const currentLineRange = activeEditor.document.lineAt(
      cursorPosition.line
    ).range;

    decorationTimeout = setTimeout(async () => {
      // console.time("all");
      const currentFileLinesInfo = await executeCommand(
        `hg blame -cu "${activeEditor.document.fileName}"`
      );

      const currentLineInfo =
        currentFileLinesInfo.split("\n")[currentLineRange.end.line];
      const changeset = currentLineInfo.split(":")[0].split(" ").at(-1);

      const {
        commitMsgPromise,
        authorNamePromise,
        authorEmailPromise,
        branchPromise,
        datePromise,
      } = getCommitStats(changeset, parentDirectory);

      // console.time("stats");
      const [commitMsg, authorName, authorEmail, date, branch] =
        await Promise.all([
          commitMsgPromise,
          authorNamePromise,
          authorEmailPromise,
          datePromise,
          branchPromise,
        ]);
      // console.timeEnd("stats");
      // console.timeEnd("all");

      const dateAgo = timeAgo(date);
      const formattedDate = new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      });

      const hoverProvider = vscode.languages.registerHoverProvider(
        { scheme: "file" },
        {
          provideHover(document, position, token) {
            // Check if the cursor is within the range of your decorated area
            if (position.isEqual(currentLineRange.end)) {
              // Return a tooltip with the content you want to show
              const hoverContent = new vscode.MarkdownString(
                `<div>
                  <p><b>Author:</b> <a href="mailto:${authorEmail}">${authorName}</a></p>
                  <p><b>Branch:</b> ${branch}</p>
                  <p><b>Date:</b> ${dateAgo} (${formattedDate})</p>
                  <p style="width: 400px; display: flex;">
                    <b>Message:</b>
                    <span style="margin-left: 20px; color: red;">${commitMsg}</span>
                  </p>
                </div>
                `
              );
              hoverContent.supportHtml = true;
              hoverContent.isTrusted = true;
              return new vscode.Hover(hoverContent);
            }
          },
        }
      );

      hover = hoverProvider;

      const decorationType = vscode.window.createTextEditorDecorationType({
        userSelect: "none",
        after: {
          contentText: `${authorName}, ${dateAgo} • ${commitMsg}`,
          margin: "0 0 0 2em",
          color: "#99999959",
        },
      });

      decoration = decorationType;
      activeEditor.setDecorations(decoration, [{ range: currentLineRange }]);
    }, 400);
  });

}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
  activate,
  deactivate,
};
