import DatasetDropdown from "./DatasetDropdown";
import ModelDropdown from "./ModelDropdown";

function Sidebar({ 
  selectedDataset, 
  setSelectedDataset, 
  setLabel,
  setTestSize, 
  selectedModel, 
  setSelectedModel, 
  device, 
  setDevice, 
  setBatchSize, 
  handleLoad 
}) {
  return (
    <aside className="Sidebar">
      <h3>
        Configuration
      </h3>

      <h4>
        Choose dataset:
      </h4>
      <DatasetDropdown selectedDataset={selectedDataset} setSelectedDataset={setSelectedDataset} />

      <h4>
        Label variable:
      </h4>
      <input name="LabelVariable" onChange={(e) => setLabel(e.target.value)}/>

      <h4>
        Test set size:
      </h4>
      <div className="inputWithUnit">
        <input name="TestsetSize" type="number" onChange={(e) => setTestSize(e.target.value)}/><span>%</span>
      </div>

      <h4>
        Choose model:
      </h4>
      <ModelDropdown selectedModel={selectedModel} setSelectedModel={setSelectedModel} />

      <h4>
        Device:
      </h4>
      <div className='Device'>
        <select
          className='Device-select'
          value={device}
          onChange={(e) => setDevice(e.target.value)}
        >
          <option value='' disabled>
            -- Please choose an option --
          </option>
          <option key='cpu' value='cpu'>
            CPU
          </option>
          <option key='cuda' value='cuda'>
            CUDA
          </option>
        </select>
      </div>

      <h4>
        Batch size:
      </h4>
      <input name="BatchSize" type="number" onChange={(e) => setBatchSize(e.target.value)} />

      <button onClick={handleLoad}>
        Load into notebook
      </button>
    </aside>
  );
}

export default Sidebar;