import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import '../styles/Editor.css';
import Cell from '../components/Cell';
import Sidebar from '../components/Sidebar';

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
  const [dataset, setDataset] = useState(location.state?.dataset || '');

  // State that holds the selected model for the application
  const [model, setModel] = useState(location.state?.model || '');

  // State that holds the label field name for the application
  const [label, setLabel] = useState(null);

  // State that holds the test set size for the dataset in the application
  const [testSize, setTestSize] = useState(null);

  // State that holds the device name for the application
  const [device, setDevice] = useState('');

  // State that holds the batch size chosen for the model in the application
  const [batchSize, setBatchSize] = useState(null);

  // Handler to update the cell with the output of the code block
	const updateCellOutput = (cellIndex, newOutput) => {
    setCells((prevCells) =>
      prevCells.map((cell, i) =>
        i === cellIndex ? { ...cell, outputs: [...(cell.outputs || []), newOutput] } : cell
      )
    );
  };

  // Handler to inject the data and model loading code cell in the notebook
  const handleInject = () => {

    // Ensure all the fields are populated before proceeding
    if (!dataset || !model || !label || !device || !batchSize) {
      alert('Please ensure that all the fields in the Configuration panel are valid');
      return;
    }

    // Inject the state variables in the dataset and model loading code
    const newCode = [
      'from datasets import load_dataset\n',
      `dataset = load_dataset("${dataset}", split="train[:${testSize}%]", trust_remote_code=True, download_mode="reuse_cache_if_exists")\n`,
      `labels = dataset["${label}"]\n`,
      'from helical.utils import get_anndata_from_hf_dataset\n',
      'ann_data = get_anndata_from_hf_dataset(dataset)\n',
      'ann_data\n',
      `from helical.models.${model?.id} import ${model?.name}, ${model?.name}Config\n`,
      `device = "${device}"\n`,
      `model_config = ${model?.name}Config(batch_size=${batchSize},device=device)\n`,
      `model = ${model?.name}(configurer=model_config)\n`
    ];

    // Create a new Code Cell
    const newCell = {
      cell_type: "code",
      execution_count: null,
      id: uuidv4(),
      source: newCode,
      metadata: {
        tags: []
      },
      outputs: []
    };

    // Add the new cell at the top of the cell list
    setCells([newCell, ...cells]);
  };

  // UseEffect to start the kernel upon rendering the editor
  useEffect(() => {
    let currentSessionId = null;
    
    // Async function to start the kernel
    const startKernel = async () => {
      try {
        
        const response = await fetch('/api/kernel/start');

        if (!response.ok) {
          throw new Error(`Failed to start kernel: ${response.statusText}`);
        }

        console.log("Starting new kernel...");
        const kernel_info = await response.json();

        setKernel(kernel_info.sessionId);
        currentSessionId = kernel_info.sessionId;
        console.log("Kernel started:", currentSessionId);

      } catch (err) {
        console.error("Error starting the kernel:", err);
      }
    };

    startKernel();

    // Close the kernel when the editor component unmounts
    return () => {
      if (currentSessionId) {
        console.log('Shutting down kernel for session:', currentSessionId);
        const body = new Blob([JSON.stringify({sessionId: currentSessionId})], {
          type: 'application/json'
        });
        if (navigator.sendBeacon('/api/kernel/stop', body)) {
          console.log('Kernel stopped:', currentSessionId);
        }
        else {
          console.error('Failed to queue shutdown request');
        }
      }
    };
  }, []);

  return (
    <div className='Editor'>
      <Sidebar 
        selectedDataset={dataset} 
        selectedModel={model} 
        setSelectedDataset={setDataset} 
        setSelectedModel={setModel}
        setLabel={setLabel}
        setTestSize={setTestSize}
        device={device}
        setDevice={setDevice}
        setBatchSize={setBatchSize}
        handleLoad={handleInject}
      />
      <main>
        {/* Iterate through the list of cells obtained from the parsed notebook */}
        {cells.map((cell, index) => (
          <Cell 
            key={index} 
            cell={cell} 
            kernel={kernel} 
            onExecute={(newOutput) => updateCellOutput(index, newOutput)} 
          />
        ))}
      </main>
    </div>
  );
}

export default Editor;