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
        ExtensionUtils  = brackets.getModule("utils/ExtensionUtils"),
        EditorManager   = brackets.getModule('editor/EditorManager'),
        DocumentManager = brackets.getModule('document/DocumentManager');
    
    var editor, startLine;
    
    function action(instance, line, gutter, event) {
        
        var anchor = {line: line, ch: 0};
        var head = {line: line, ch: null};
        var cursor = instance.getCursor();
        
        startLine = line;
        
        if (gutter === 'CodeMirror-linenumbers') {
            if (!event.ctrlKey && !event.shiftKey) {
                instance.setSelection(anchor, head);
            } else if (event.ctrlKey) {
                instance.addSelection(anchor, head);
            } else if (event.shiftKey) {
                var oldLine = cursor.line;
                var newLine = instance.lineAtHeight(event.pageY);

                if (instance.somethingSelected()) {
                    if (newLine > oldLine) {
                        instance.extendSelection({line: newLine, ch: 0});
                    } else {
                        instance.extendSelection(
                            {line: newLine, ch: 0},
                            {line: oldLine, ch: null}
                        );
                    }
                } else {
                    instance.setSelection(
                        {line: cursor.line, ch: cursor.ch},
                        {line: newLine, ch: null}
                    );
                }
            }
        }
        
        var lineSelecting = function (e) {
            var newLine = instance.lineAtHeight(e.pageY);
            
            if (!event.ctrlKey) {
                instance.setSelection(
                    {line: startLine, ch: startLine < newLine ? 0 : null},
                    {line: newLine, ch: startLine < newLine ? null : 0}
                );
            } else {
                instance.addSelection(
                    {line: startLine, ch: startLine < newLine ? 0 : null},
                    {line: newLine, ch: startLine < newLine ? null : 0}
                );
            }
        };
        
        var lineSelectStop = function (e) {
            $('body').off('mousemove', lineSelecting).off('mousemove', lineSelecting);
            startLine = null;
        };
        
        $('body').on('mousemove', lineSelecting).on('mouseup', lineSelectStop);
        
    }
    
    function update() {
        
        startLine = null;
        
        editor = EditorManager.getCurrentFullEditor();
        
        if (editor) {
            editor._codeMirror.on('gutterClick', action);
        }
        
    }
    
    ExtensionUtils.loadStyleSheet(module, "style.css");
    
    AppInit.appReady(update);
    $(DocumentManager).on('currentDocumentChange', update);
    
});
