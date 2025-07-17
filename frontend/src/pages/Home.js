import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../assets/logo.svg';
import '../styles/Home.css';
import SelectionModal from '../components/SelectionModal';

function Home() {
  // Navigator to allow moving to a different page
  const navigate = useNavigate();

  // State to control the visibility of the modal showing the next steps
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State to store information about the chosen application (notebook)
  const [notebookData, setNotebookData] = useState(null);

  // State to hold the selected application by the user
  const [selectedApplication, setSelectedApplication] = useState('');

  // State to hold the list of available applications from the Helical repository
  const [availableApplications, setAvailableApplications] = useState(null);

  // Ref to reset the file value on Render
  const fileInputRef = useRef(null);

  // Handler for when the user selects an option from the model dropdown
	const handleApplicationDropdownChange = (event) => {
		setSelectedApplication(event.target.value);
	};

  // Handler for when the user chooses an existing application
  const handleAppClick = async (event) => {
    const selectedName = event.target.innerText;
    
    // Find the corresponding path for the notebook file
    var path = '';
    for (let i = 0; i < availableApplications?.length; i++) {
      if (availableApplications[i]?.name === selectedName) {
        path = availableApplications[i]?.path;
      }
    }
    
    if (!path) return;

    // Asynchronously fetch the notebook file and update the state
    try {
      // Fetch the notebook file
      const response = await fetch(path);

      if (!response.ok) {
        throw new Error(`Failed to fetch notebook: ${response.statusText}`);
      }

      // Parse the response body as JSON
      const notebookContent = await response.json();

      // Launch editor if notebook content is loaded
      if (notebookContent) {
        navigate('/editor', { state: { notebook: notebookContent } });
      }
      else {
        console.error('Notebook data could not be found');
        alert('Notebook data not found');
        closeModal();
      }
    }
    catch (error) {
      console.error('Failed to load notebook:', error);
      alert('Could not load the selected notebook');
    }
  };

  // Handler for when the user uploads a file
  const handleFileChange = (event) => {
    // Check if the user has selected a single file
    if (event.target.files && event.target.files.length === 1) {
      const selectedFile = event.target.files[0];
      if (!selectedFile) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target.result);
          setNotebookData(content);
          setIsModalOpen(true);
        }
        catch (error) {
          console.error('Failed to parse notebook:', error);
          alert('Could not read the uploaded notebook')
        }
      };
      reader.readAsText(selectedFile);

      // Reset the ref to allow the handler to be triggered again even if the file chosen is the same
      if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handler to set the visibility of the modal to false if the user clicks away or proceeds to the next step
  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {

    const getAvailableApplications = async () => {
      try {
        const response = await fetch('/api/notebooks');
        if (!response.ok) {
          throw new Error('Could not get applications from the server');
        }
        const data = await response.json();
        setAvailableApplications(data);
      }
      catch (error) {
        console.error('Failed to fetch notebooks:', error);
      }
    };

    getAvailableApplications();
  }, []);

  return (
    <div className='Home'>
      <header className='Home-header'>
        <img src={logo} className='Home-logo' alt='logo' />
        <h1>
          Welcome to Helical Web
        </h1>
        <p>
          To get started, choose one of the following applications:
        </p>

        {/* Dropdown menu for the Notebook selection */}
        <div className='Application'>
          <select
            className='Application-select'
            value={selectedApplication}
            onChange={handleApplicationDropdownChange}
          >
            <option value='' disabled>
              -- Please choose an application --
            </option>

            {availableApplications?.map((application) => (
              <option key={application.name} value={application.path}>
                {application.name}
              </option>
            ))}
          </select>
        </div>

        <p>
          OR
        </p>

        {/* Upload option for users to select their own Helical notebook */}
        <input
          type='file'
          id='file-upload'
          ref={fileInputRef}
          accept='.ipynb'
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor='file-upload' className='Home-link'>
          Upload your own application (.ipynb)
        </label>

        {/* SelectionModal to show the next steps after choosing an application */}
        {isModalOpen && <SelectionModal onClose={closeModal} notebookData={notebookData}/>}
      </header>
    </div>
  );
}

export default Home;
