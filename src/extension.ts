import { ExtensionContext, languages, window, workspace } from "vscode";
import { downloadConfiguration } from "./helpers/downloadConfiguration";
import { fileValidator } from "./fileValidator";

// This method is called when extension is activated for the first time
export function activate(context: ExtensionContext) {
  const DIAGNOSTIC_COLLECTION = languages.createDiagnosticCollection(
    "too-long-line-limit"
  );

  // This line of code will only be executed once when extension is activated
  console.log('Extension "Too Long - line limit" is now active.');

  // Listen for document focus changes
  window.onDidChangeActiveTextEditor((e) => {
    if (!e) {
      return;
    }

    // Run line validation
    fileValidator(e, DIAGNOSTIC_COLLECTION);

    // Download new configuration, when configuration changed
    downloadConfiguration();
  });

  // Listen for document changes
  workspace.onDidChangeTextDocument((e) => {
    if (!window.activeTextEditor) {
      // No open text editor
      DIAGNOSTIC_COLLECTION.delete(e.document.uri);
      return;
    }
    fileValidator(e, DIAGNOSTIC_COLLECTION);
  });

  // Listen if file is closed
  workspace.onDidCloseTextDocument((e) =>
    // Delete diagnostic for this file
    DIAGNOSTIC_COLLECTION.delete(e.uri)
  );
}

// This method is called when extension is deactivated
export function deactivate() {
  // Remove rulers
  workspace.getConfiguration("editor").update("rulers", [], true);
}
