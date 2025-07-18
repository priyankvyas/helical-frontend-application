import { useRef, useState } from "react";

function DatasetDropdown({ selectedDataset, setSelectedDataset }) {

  // Ref to reset the file value on Render
	const fileInputRef = useRef(null);
  
  // A list of predefined datasets
  const availableDatasets = [
    { id: 'ds1', name: 'helical-ai/yolksac_human' },
    { id: 'ds2', name: 'InstaDeepAI/nucleotide_transformer_downstream_tasks_revised' },
    { id: 'ds3', name: 'mRFP_Expression' },
  ];

  // State to store the list of available datasets
  const [datasets, setDatasets] = useState(availableDatasets);

  // Handler for when the user selects an option from the dataset dropdown
	const handleDatasetDropdownChange = (event) => {
		if (event.target.value === 'upload') {
			fileInputRef.current.click();
		}
		else {
			setSelectedDataset(event.target.value);
		}
	};

  // Handler for when user uploads their own dataset
	const handleFileChange = (event) => {
		// Check if the user has selected a single file
		if (event.target.files && event.target.files.length === 1) {
			const selectedFile = event.target.files[0];
			console.log('File uploaded: ', selectedFile.name);
      
      const newDataset = {
        id: `ds${datasets.length + 1}`,
        name: selectedFile.name
      };

      setDatasets([...datasets, newDataset]);
			setSelectedDataset(newDataset.name);
			
			// Reset the ref to allow the handler to be triggered again even if the file chosen is the same
			if(fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	};

  return (
    <div className='Dataset'>
      <select
        className='Dataset-select'
        value={selectedDataset}
        onChange={handleDatasetDropdownChange}
      >
        <option value='' disabled>
          -- Please choose an option --
        </option>
        
        {/* The option to trigger the file upload */}
        <option value='upload'>Upload your own...</option>

        {datasets.map((dataset) => (
          <option key={dataset.id} value={dataset.name}>
            {dataset.name}
          </option>
        ))}
      </select>
      
      {/* Hidden input field for dataset upload */}
      <input
        type='file'
        ref={fileInputRef}
        accept='.csv'
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}

export default DatasetDropdown;