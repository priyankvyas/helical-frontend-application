import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/SelectionModal.css';
import DatasetDropdown from './DatasetDropdown';
import ModelDropdown from './ModelDropdown';

function SelectionModal({ onClose, notebookData }) {
  // Navigator to allow moving to a different page
  const navigate = useNavigate();

	// State to manage the selected dataset from the dropdown
	const [selectedDataset, setSelectedDataset] = useState('');

	// State to manage the selected model from the dropdown
	const [selectedModel, setSelectedModel] = useState('');

	// Handler for when the dataset and model is selected and the user wants to launch the editor
	const launchEditor = () => {
	  if (notebookData) {
			navigate('/editor', { state: { notebook: notebookData, dataset: selectedDataset, model: selectedModel } });
	  }
		else {
			console.error('Notebook data could not be found');
			alert('Notebook not found');
			onClose();
		}
	};

	return (
		<div className='SelectionModal' onClick={onClose}>
			<div className='SelectionModal-content' onClick={(e) => e.stopPropagation()}>
				<h2>
				  1. Select Dataset
				</h2>
				<p>
				  You can upload your own dataset or choose from the list of example datasets.
				</p>

				{/* Dataset selection dropdown menu */}
				<DatasetDropdown selectedDataset={selectedDataset} setSelectedDataset={setSelectedDataset} />

				{selectedDataset && (
					<div>
						<h2>2. Select Model</h2>
						<p>Choose from the list of models available in the Helical package to run your experiment with.</p>

						{/* Model selection dropdown menu */}
						<ModelDropdown selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
					</div>
				)}

				<button onClick={launchEditor} className='launch-button' disabled={!selectedModel}>
					Launch Editor
				</button>
				<button onClick={onClose} className='cancel-button'>
					Cancel
				</button>
			</div>
		</div>
	);
}

export default SelectionModal;