import MarkdownCell from './MarkdownCell';
import CodeCell from './CodeCell';

function Cell({ cell, kernel, onExecute }) {
  
  // If the Cell is a Markdown cell, render a MarkdownCell component
  if (cell.cell_type === 'markdown') {
    return <MarkdownCell source={cell.source.join('')} />;
  }

  // If the Cell is a code cell, render a CodeCell component
  if (cell.cell_type === 'code') {
    return <CodeCell cell={cell} kernel={kernel} onExecute={onExecute} />;
  }

  return null;
}

export default Cell;