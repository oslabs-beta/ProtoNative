import React from 'react';
import { generateCustomComponentCode } from '../../parser/parser';

const CodeBlock = (): JSX.Element => {
  return (
    <div id='code-block-container'>
      <h2>Code Preview</h2>
      <div id='code-preview-container'>

      </div>
    </div>
  )
}

export default CodeBlock;