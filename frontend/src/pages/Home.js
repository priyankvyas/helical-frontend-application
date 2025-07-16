import { useState, useRef } from 'react';
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

  // Map of notebook files for example Helical applications
  const notebookFiles = [
    { id: 'Quick Start', name: './notebooks/Quick-Start-Tutorial.ipynb' },
		{ id: 'Cell Type Annotation', name: './notebooks/Cell-Type-Annotation.ipynb' },
    { id: 'Cell Type Classification Fine-Tuning', name: './notebooks/Cell-Type-Classification-Fine-Tuning.ipynb' },
  ];

  // Ref to reset the file value on Render
  const fileInputRef = useRef(null);

  // Handler for when the user chooses an existing application
  const handleAppClick = async (event) => {
    const selectedName = event.target.innerText;
    
    // Find the corresponding path for the notebook file
    var path = '';
    for (let i = 0; i < notebookFiles.length; i++) {
      if (notebookFiles[i].id === selectedName) {
        path = notebookFiles[i].name;
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

        {/* List of example applications */}
        {notebookFiles.map((application) => (
          <p onClick={handleAppClick} className='Home-link' key={application.id}>
            {application.id}
          </p>
        ))}
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
