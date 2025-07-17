import { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';

function CodeCell({ cell, kernel, onExecute }) {

  // State to hold the text content of the code block
  const [code, setCode] = useState(cell.source.join(''));

  // State to hold the outputs of the cell after execution
  const [outputs, setOutputs] = useState(cell.outputs || []);

  // Handler to execute the code within the code block
  const handleExecute = async () => {
    // Clear previous outputs in case the cell has been run before
    setOutputs([]);
    
    try {

      // Send a request to the server to execute the code on the Jupyter kernel on the server
      const response = await fetch('/api/kernel/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: kernel,
          code: code
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to execute code: ${response.statusText}`);
      }

      const outputs = await response.json();
      console.log(outputs);

      // Get the output of the code block from the kernel
      const outputContent = outputs.output;

      // Update the output of the code block
      setOutputs((prev) => [...prev, outputContent]);

      // Update the state of the Editor to render the cell with its output
      onExecute(outputContent);
    }
    catch (err) {
      console.error('Error executing the kernel:', err);
    }
  };

  useEffect(() => {
    let parsedOutputs = [];
    if (outputs.length !== 0) {
        for (let i = 0; i < outputs.length; i++) {
            if (outputs[i].data) {
                parsedOutputs = [...parsedOutputs, outputs[i].data['text/plain'].join('\n')];
            }
            else {
                parsedOutputs = [...parsedOutputs, outputs[i].text.join('\n')];
            }
        }
        setOutputs(parsedOutputs);
    }
  }, []);

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