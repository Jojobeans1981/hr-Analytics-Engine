const path = require('path');
const ts = require('typescript');

// Monkey-patch TypeScript's path comparison
const originalAttachFileToDiagnostic = ts.attachFileToDiagnostic;
ts.attachFileToDiagnostic = function(diagnostic, file) {
  if (file) {
    file = path.normalize(file);
  }
  return originalAttachFileToDiagnostic(diagnostic, file);
};98\