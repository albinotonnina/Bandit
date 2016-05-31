/**
 * LiveCoding 0.2 for Reveal.js
 * Vincent De Oliveira
 */
var LiveCoding = (function () {

    // All <code> with ".liveCoding" class
    var codeElementList = document.querySelectorAll('code.liveCoding');


    for (var i = 0; i < codeElementList.length; i++) {
        update(codeElementList[i]);

        // update when keyUp
        codeElementList[i].addEventListener('keyup', function () {
            update(this);
        });
        // update when keyUp
        codeElementList[i].addEventListener('keydown', function (e) {
            var keyCode = e.keyCode || e.which;
            if (keyCode == 9) {
                e.preventDefault();  // this will prevent us from tabbing out of the editor

                // now insert four non-breaking spaces for the tab key
                var editor = e.target;
                var doc = editor.ownerDocument.defaultView;
                var sel = doc.getSelection();
                var range = sel.getRangeAt(0);

                if (!event.shiftKey) {
                    var tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0");
                    range.insertNode(tabNode);
                    range.setStartAfter(tabNode);
                    range.setEndAfter(tabNode);
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else {
                    var lastNode = sel.focusNode;
                    range.setStartBefore(lastNode);
                    range.setEndAfter(lastNode);
                    range.deleteContents();
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
                
            }
        });
    }

    /**
     * Update
     */
    function update(codeElement) {

        var demoElementId = codeElement.attributes.getNamedItem('data-livecoding-id').nodeValue;
        var demoElement = document.getElementById(demoElementId);

        // highlight.js and prism.js
        var isCSS = hasAtLeastOneClass(codeElement, ['css', 'language-css']);
        var isMarkup = hasAtLeastOneClass(codeElement, ['xml', 'language-markup', 'language-xml', 'language-html', 'language-svg']);

        // if it's CSS
        if (isCSS) {
            var cssRules = codeElement.textContent;

            // if PrefixFree is here
            if (typeof PrefixFree !== "undefined") {
                // prefix code
                cssRules = PrefixFree.prefixCSS(cssRules);
            }

            // cleanup
            cssRules = cssRules.replace(/^\s+/g, '').replace(/\s+$/g, '');
            var reg = /(\{|\})/g;
            cssRules = cssRules.split(reg);
            for (var i = 0; i < cssRules.length - 1; i += 4) {
                var selectors = cssRules[i].split(',');
                for (var j = 0; j < selectors.length; j++) {
                    selectors[j] = '#' + demoElementId + ' ' + selectors[j];
                }
                cssRules[i] = selectors.join(',');
            }
            cssRules = cssRules.join('');

            // if <style id="liveCoding_9999"> doesn't exist, create it
            var styleElement = document.getElementById('liveCoding_' + demoElementId);
            if (styleElement === null) {
                styleElement = document.createElement('style');
                styleElement.setAttribute('id', 'liveCoding_' + demoElementId);
                insertAfter(demoElement, styleElement);
            }
            styleElement.innerHTML = cssRules;

            // else, if it's markup (HTML, SVG, XML...)
        } else if (isMarkup) {
            // replace content
            demoElement.innerHTML = codeElement.innerText;
        }

        function hasAtLeastOneClass(element, classList) {
            for (var i = 0; i < classList.length; i++) {
                if (element.classList.contains(classList[i])) {
                    return true;
                }
            }
            return false;
        }

        function insertAfter(referenceNode, newNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }
    }

})();
