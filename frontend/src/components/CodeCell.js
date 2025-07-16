import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';

function CodeCell({ cell, kernel, onExecute }) {

  // State to hold the text content of the code block
  const [code, setCode] = useState(cell.source.join(''));

  // State to hold the outputs of the cell after execution
  const [outputs, setOutputs] = useState(cell.outputs || []);

  // Handler to execute the code within the code block
  const handleExecute = () => {

    // Clear previous outputs in case the cell has been run before
    setOutputs([]);

    // Send a request to the kernel of the notebook to execute the code
    const future = kernel.requestExecute({ code });
    future.onIOPub = (msg) => {
      
      // Get the output of the code block from the kernel
      const outputContent = msg.content.text;

      // Update the output of the code block
      setOutputs((prev) => [...prev, outputContent]);

      // Update the state of the Editor to render the cell with its output
      onExecute(outputContent);
    };
  };

  return (
    <div className='CodeCell'>
      
      {/* Code Mirror component to create an editable Python code block */}
      <CodeMirror value={code} extensions={[python()]} onChange={(value) => setCode(value)} />
      
      {/* Run button to execute the code in the cell */}
      <button onClick={handleExecute}>Run</button>

      {/* Output div to display the output of the code in the cell */}
      <div className='CodeCell-output'>
        {outputs.map((out, i) => (
          <pre key={i}>{String(out)}</pre>
        ))}
      </div>
    </div>
  );
}

export default CodeCell;