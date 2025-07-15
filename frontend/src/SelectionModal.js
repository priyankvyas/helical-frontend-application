import { useState, useRef } from 'react';
import './SelectionModal.css';

function SelectionModal({ onClose }) {
    // A list of predefined datasets
    const availableDatasets = [
        { id: 'ds1', name: 'helical-ai/yolksac_human' },
        { id: 'ds2', name: 'InstaDeepAI/nucleotide_transformer_downstream_tasks_revised' },
        { id: 'ds3', name: 'mRFP_Expression' },
    ];

    // A list of availabe models
    const availableModels = [
        { id: 'md1', name: 'scGPT' },
        { id: 'md2', name: 'Geneformer' },
        { id: 'md3', name: 'Evo 2' },
        { id: 'md4', name: 'Helix mRNA' },
        { id: 'md5', name: 'TranscriptFormer' },
        { id: 'md6', name: 'GenePT' },
        { id: 'md7', name: 'Hyena DNA' },
        { id: 'md8', name: 'UCE' },
    ];

    // State to manage the selected dataset from the dropdown
    const [selectedDataset, setSelectedDataset] = useState('');

    // State to manage the selected model from the dropdown
    const [selectedModel, setSelectedModel] = useState('');

    // Ref to reset the file value on Render
    const fileInputRef = useRef(null);

    // Handler for when the user selects an option from the dataset dropdown
    const handleDatasetDropdownChange = (event) => {
        if (event.target.value === 'upload') {
            fileInputRef.current.click();
        }
        else {
            setSelectedDataset(event.target.value);
        }
    };

    // Handler for when the user selects an option from the model dropdown
    const handleModelDropdownChange = (event) => {
        setSelectedModel(event.target.value);
    };

    // Handler for when user uploads their own dataset
    const handleFileChange = (event) => {
        // Check if the user has selected a single file
        if (event.target.files && event.target.files.length === 1) {
            const selectedFile = event.target.files[0];
            console.log('File uploaded: ', selectedFile.name);
            setSelectedDataset(selectedFile.name);
            
            // Reset the ref to allow the handler to be triggered again even if the file chosen is the same
            if(fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Handler for when the dataset and model is selected and the user wants to launch the editor
    const launchEditor = () => {
        onClose();
    };

    return (
        <div className='SelectionModal' onClick={onClose}>
            <div className='SelectionModal-content' onClick={(e) => e.stopPropagation()}>
                <h2>1. Select Dataset</h2>
                <p>You can upload your own dataset or choose from the list of example datasets.</p>

                {/* Dataset selection dropdown menu */}
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

                        {availableDatasets.map((dataset) => (
                            <option key={dataset.id} value={dataset.id}>
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

                {selectedDataset && (
                    <div>
                        <h2>2. Select Model</h2>
                        <p>Choose from the list of models available in the Helical package to run your experiment with.</p>

                        {/* Model selection dropdown menu */}
                        <div className='Model'>
                            <select
                                className='Model-select'
                                value={selectedModel}
                                onChange={handleModelDropdownChange}
                            >
                                <option value='' disabled>
                                    -- Please choose an option --
                                </option>

                                {availableModels.map((model) => (
                                    <option key={model.id} value={model.id}>
                                        {model.name}
                                    </option>
                                ))}
                            </select>
                        </div>
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