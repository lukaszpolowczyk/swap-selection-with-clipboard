
const vscode = require('vscode');
const clipboardy = require('clipboardy');

const {Selection} = vscode;

function getWordAndSelection(selection, textEditor) {
  const wordRange = textEditor.document.getWordRangeAtPosition(selection.start);
  
  const newSelection = selection.isEmpty && wordRange?new Selection(wordRange.start, wordRange.end) : selection;
  
  const sText = textEditor.document.getText(newSelection);
  return { newSelection, sText };
}

function activate(context) {
    
  let disposable = vscode.commands.registerTextEditorCommand('extension.swap', function (textEditor, edit) {
      
    if (textEditor.selections.length === 2) {
        
      const selections = textEditor.selections;
      
      const { newSelection: sel0, sText: sText0 } = getWordAndSelection(selections[0], textEditor);
      const { newSelection: sel1, sText: sText1 } = getWordAndSelection(selections[1], textEditor);
      
      textEditor.selections = [
        sel0,
        sel1
      ];
      
      edit.replace(sel0, sText1);
      edit.replace(sel1, sText0);
        
    } else 
    if (textEditor.selections.length === 1) {
      const cText = clipboardy.readSync();
      
      const selection = textEditor.selection;
      
      const { newSelection, sText } = getWordAndSelection(selection, textEditor);
      
      textEditor.selection = newSelection;
      edit.replace(newSelection, cText);
      
      clipboardy.writeSync(sText);
    }
  });
  
  context.subscriptions.push(disposable);
    

  
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;