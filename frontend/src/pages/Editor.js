import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ServiceManager, ServerConnection } from '@jupyterlab/services';

import '../styles/Editor.css';
import Cell from '../components/Cell';

function Editor() {
  // Location object that contains the state passed from the previous page
  const location = useLocation();

  // State that holds the parsed Jupyter notebook
  const [notebookData, ] = useState(location.state?.notebook || null);

  // State that holds the cells from the parsed Jupyter notebook
	const [cells, setCells] = useState(notebookData?.cells || []);

  // State that holds the kernel in use for the Jupyter notebook
  const [kernel, setKernel] = useState(null);

  // State that holds the selected dataset for the application
  const [dataset, setDataset] = useState(location.state?.dataset || null);

  // State that holds the selected model for the application
  const [model, setModel] = useState(location.state?.model || null);

  // Handler to update the cell with the output of the code block
	const updateCellOutput = (cellIndex, newOutput) => {
    setCells((prevCells) =>
      prevCells.map((cell, i) =>
        i === cellIndex ? { ...cell, outputs: [...(cell.outputs || []), newOutput] } : cell
      )
    );
  };

  // UseEffect to start the kernel upon rendering the editor
  useEffect(() => {
    let serviceManager;

    // Async function to start the kernel
    const startKernel = async () => {
      try {

        // Configuration for the local Jupyter server
        const serverSettings = ServerConnection.makeSettings({
          baseUrl: 'http://localhost:8888',
          token: 'f6de464ba4b3b89ddfa55ea7df424b99ff5bcd95df24a3a3',
        });
        
        serviceManager = new ServiceManager({ serverSettings: serverSettings });
        await serviceManager.ready;

        console.log("Starting new kernel...");
        const newKernel = await serviceManager.kernels.startNew({ name: 'python3' });
        setKernel(newKernel);
        console.log("Kernel started:", newKernel.id);

      } catch (err) {
        console.error("Error starting the kernel:", err);
      }
    };

    startKernel();

    // Close the kernel when the editor component unmounts
    return () => {
      console.log("Shutting down kernel...");
      if (kernel) {
        kernel.shutdown();
      }
    };
  }, []);

  return (
    <div className='Editor'>

      {/* Iterate through the list of cells obtained from the parsed notebook */}
      {cells.map((cell, index) => (
        <Cell 
          key={index} 
          cell={cell} 
          kernel={kernel} 
          onExecute={(newOutput) => updateCellOutput(index, newOutput)} 
        />
      ))}
    </div>
  );
}

export default Editor;