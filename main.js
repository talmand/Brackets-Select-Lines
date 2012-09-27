/*
* Copyright (c) 2012 Travis Almand. All rights reserved.
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
    
    var CommandManager = brackets.getModule("command/CommandManager"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        ExtensionUtils  = brackets.getModule("utils/ExtensionUtils");
    
    var lineNumbers = [];
    
    function compareNumbers(a, b) { return a - b; }
    function stopSelecting() {
        $(".CodeMirror-gutter-text").off("mouseover").off("hover");
        lineNumbers = [];
    }
    
    $(".CodeMirror-gutter-text").on("mousedown", "pre", function (e) {
        
        // grab the first line on that initial click
        lineNumbers.push(parseInt($(e.target).text(), 10));
       
        $(".CodeMirror-gutter-text").on("mouseover", "pre", function (e) {
            
            // check to see if line number is already in the mix
            var i, lineNumbersLength = lineNumbers.length, $target = $(e.target), match = false;
            for (i = 0; i < lineNumbersLength; i++) {
                if (i === $target.text()) {
                    match = true;
                    break;
                }
            }
            
            // insert new line numbers and sort each time
            // we need them properly sorted to properly select the lines
            if (!match) {
                lineNumbers.push(parseInt($target.text(), 10));
                lineNumbers.sort(compareNumbers);
            }
            
            // establish start and end points
            // select those lines
            var startLine = lineNumbers[0] - 1;
            var endLine = lineNumbers[lineNumbersLength] - 1;
            var endLineLength = DocumentManager.getCurrentDocument().getLine(endLine).length;
            EditorManager.getCurrentFullEditor()._codeMirror.setSelection({line: startLine, ch: 0}, {line: endLine, ch: endLineLength});
            
        });
        
    // here we cover letting go of mouse button and leaving gutter
    // this doesn't work if cursor leaves gutter if mouse is still down
    }).on("mouseup", "pre", stopSelecting);
    
    // this fixes cursor leaving gutter with mouse down problem
    $("#sidebar, .CodeMirror-lines").on("mouseover", stopSelecting);
    
});