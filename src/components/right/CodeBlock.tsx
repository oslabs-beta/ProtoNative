import React, { useState, useContext, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx.min';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.min.js';
import 'prism-themes/themes/prism-shades-of-purple.css';
import 'prismjs/plugins/match-braces/prism-match-braces.min';
import 'prismjs/plugins/match-braces/prism-match-braces.css';
import { generateCustomComponentCode, formatCode } from '../../parser/parser';
import { OrigCustomComp } from '../../parser/interfaces';

const CodeBlock = (): JSX.Element => {
  const { currentComponent, originals, copies } = useContext(AppContext);
  const [code, setCode] = useState(null);

  useEffect(() => {
    const code = formatCode(
      generateCustomComponentCode(
        originals[currentComponent] as OrigCustomComp,
        originals,
        copies
      )
    );
    setCode(code);

    Prism.highlightAll(null, () => {
      // find all custom elements and add a different class so they can be a different color
      const consoleKeyword = document.querySelectorAll('.class-name');
      consoleKeyword.forEach((keyword) => {
        if (
          keyword.textContent !== 'View' &&
          keyword.textContent !== 'Button' &&
          keyword.textContent !== 'Text' &&
          keyword.textContent !== 'Image' &&
          keyword.textContent !== 'TextInput' &&
          keyword.textContent !== 'ScrollView' &&
          keyword.textContent !== 'FlatList' &&
          keyword.textContent !== 'SectionList' &&
          keyword.textContent !== 'Switch' &&
          keyword.textContent !== 'TouchableHighlight' &&
          keyword.textContent !== 'TouchableOpacity' &&
          keyword.textContent !== 'StatusBar' &&
          keyword.textContent !== 'ActivityIndicator'
        ) {
          keyword.classList.remove('class-name');
          keyword.classList.add('custom-element');
        }
      });
    });
  });

  return (
    <>
      <div id='code-block-container'>
        <h2>Code Preview</h2>
        <div id='code-preview-container'>
          <pre className='line-numbers'>
            <code className={'language-jsx match-braces'}>{code}</code>
          </pre>
        </div>
      </div>
    </>
  );
};

export default CodeBlock;
