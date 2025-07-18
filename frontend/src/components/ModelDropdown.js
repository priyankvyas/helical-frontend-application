function ModelDropdown({ selectedModel, setSelectedModel }) {

  // A list of availabe models
  const availableModels = [
    { id: 'scgpt', name: 'scGPT' },
    { id: 'geneformer', name: 'Geneformer' },
    { id: 'evo_2', name: 'Evo2' },
    { id: 'helix_mrna', name: 'HelixmRNA' },
    { id: 'transcriptformer', name: 'TranscriptFormer' },
    { id: 'genept', name: 'GenePT' },
    { id: 'hyena_dna', name: 'HyenaDNA' },
    { id: 'uce', name: 'UCE' },
  ];
  
  // Handler for when the user selects an option from the model dropdown
	const handleModelDropdownChange = (event) => {
		const model = {
      id: event.target.key,
      name: event.target.value
    };
		setSelectedModel(model);
	};

  return (
    <div className='Model'>
      <select
        className='Model-select'
        value={selectedModel?.name}
        onChange={handleModelDropdownChange}
      >
        <option value='' disabled>
          -- Please choose an option --
        </option>

        {availableModels.map((model) => (
          <option key={model.id} value={model.name}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ModelDropdown;