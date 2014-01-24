/*
* Copyright (c) 2014 Travis Almand. All rights reserved.
*
* Permission is hereby granted, free of charge, to any person obtaining a
* copy of this software and associated documentation files (the "Software"),
* to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense,
* and/or sell copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
* DEALINGS IN THE SOFTWARE.
*/

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, $ */

define(function (require, exports, module) {
    
    'use strict';
    
    var AppInit         = brackets.getModule('utils/AppInit'),
        EditorManager   = brackets.getModule('editor/EditorManager'),
        DocumentManager = brackets.getModule('document/DocumentManager');
    
    var editor, document, selecting, selectedLines;
    
    function action(instance, line, gutter, event) {
        
        if (selecting) {            
            if (selectedLines.length === 0) { // first click
                selectedLines.push(line);
                editor._codeMirror.setSelection({line: line, ch: 0}, {line: line, ch: null});
            } else if (selectedLines.length === 1) { // second click
                selectedLines.push(line);
                if (selectedLines[0] < selectedLines[1]) {
                    editor._codeMirror.setSelection({line: selectedLines[0], ch: 0}, {line: selectedLines[1], ch: null});
                } else {
                    editor._codeMirror.setSelection({line: selectedLines[0], ch: null}, {line: selectedLines[1], ch: 0});
                }
                selectedLines.splice(1, 1);
            } else {
                // something's gone wrong somewhere, start over
                selectedLines = [];
            }
        }
        
    }
    
    function keyDown(instance, event) {
        
        if (event.keyIdentifier === 'Shift') {
            selecting = true;
        }
        
    }
    
    function keyUp(instance, event) {
        
        selecting = false;
        selectedLines = [];
        
    }
    
    function update() {
        
        selecting = false;
        selectedLines = [];
        
        editor = EditorManager.getCurrentFullEditor();
        document = DocumentManager.getCurrentDocument();
        
        editor._codeMirror.off('gutterClick', action);
        editor._codeMirror.off('keydown', keyDown);
        editor._codeMirror.off('keyup', keyUp);
        
        editor._codeMirror.on('gutterClick', action);
        editor._codeMirror.on('keydown', keyDown);
        editor._codeMirror.on('keyup', keyUp);
        
    }
    
    AppInit.appReady(update);
    $(DocumentManager).on('currentDocumentChange', update);
    
});