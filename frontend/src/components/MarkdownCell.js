import ReactMarkdown from 'react-markdown';

function MarkdownCell({ source }) {
  return (
    <div className='MarkdownCell'>
      <ReactMarkdown>
        {source}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownCell;