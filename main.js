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
    
    var AppInit = brackets.getModule('utils/AppInit'),
        EditorManager = brackets.getModule('editor/EditorManager'),
        MainViewManager = brackets.getModule('view/MainViewManager');
    
    var editor, startLine, oldPos, lineColor;
    
    function action(instance, line, gutter, event) {
        
        var anchor = {line: line, ch: 0};
        var head = {line: line + 1, ch: 0};
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
                        instance.extendSelection({line: newLine + 1, ch: 0});
                    } else {
                        instance.extendSelection(
                            {line: newLine, ch: 0},
                            {line: oldLine, ch: 0}
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
            
            if (newLine > startLine) {
                newLine += 1;
            } else if (newLine < startLine && startLine === newLine + 1) {
                startLine += 1;
            }
            
            if (!event.ctrlKey) {
                instance.setSelection(
                    {line: startLine, ch: 0 },
                    {line: newLine, ch: 0 }
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
    
    function gutterMove(e) {
        if (oldPos) {
            editor._codeMirror.removeLineClass(oldPos.line, 'background', 'ta_gutterLine');
        }
        var pos = editor._codeMirror.coordsChar({left: e.clientX, top: e.clientY});
        oldPos = pos;
        editor._codeMirror.addLineClass(pos.line, 'background', 'ta_gutterLine');
    }
    
    function gutterEnter() {
        $('.CodeMirror-gutters').on('mousemove', gutterMove);
    }
    
    function gutterLeave() {
        $('.CodeMirror-gutters').off('mousemove', gutterMove);
        if (oldPos) {
            editor._codeMirror.removeLineClass(oldPos.line, 'background', 'ta_gutterLine');
        }
    }
    
    function getColor() {
        // delay to ensure theme color is stored
        var delay = window.setTimeout(function () {
            $('#editor-holder').find('.CodeMirror').append('<div id="ta_tempColorGetter" class="CodeMirror-selected"></div>');

            lineColor = $('#ta_tempColorGetter').css('background-color');

            $('head').append('<style id="ta_customCSS">.ta_gutterLine { background-color: ' + lineColor + '; }</style>');
            
            $('#ta_tempColorGetter').remove();
        }, 1000);
    }
    
    function update() {
        startLine = null;
        
        editor = EditorManager.getCurrentFullEditor();
        
        if (editor) {
            editor._codeMirror.on('gutterClick', action);
            $('.CodeMirror-gutters')
                .on('mouseenter', gutterEnter)
                .on('mouseleave', gutterLeave);
        }
    }
    
    AppInit.appReady(function () {
        getColor();
        $(MainViewManager).on('currentFileChange', update);
    });
    
});