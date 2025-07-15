import { useState, useRef } from 'react';
import logo from './logo.svg';
import './Home.css';
import SelectionModal from './SelectionModal';

function Home() {
  // State to control the visibility of the modal showing the next steps
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ref to reset the file value on Render
  const fileInputRef = useRef(null);

  // Handler for when the user chooses an existing application
  const handleAppClick = () => {
    console.log('Existing application clicked. Show next steps modal...');
    setIsModalOpen(true);
  };

  // Handler for when the user uploads a file
  const handleFileChange = (event) => {
    // Check if the user has selected a single file
    if (event.target.files && event.target.files.length === 1) {
      const selectedFile = event.target.files[0];
      console.log('File uploaded: ', selectedFile.name);
      setIsModalOpen(true);

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
        <p onClick={handleAppClick} className='Home-link'>Quick Start</p>
        <p onClick={handleAppClick} className='Home-link'>Cell Type Annotation</p>
        <p onClick={handleAppClick} className='Home-link'>Cell Type Classification Fine-Tuning</p>
        <p>OR</p>

        {/* Upload option for users to select their own Helical notebook */}
        <input
          type='file'
          id='file-upload'
          ref={fileInputRef}
          accept='.ipynb'
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor='file-upload' className='Home-link'>Upload your own application (.ipynb)</label>

        {/* SelectionModal to show the next steps after choosing an application */}
        {isModalOpen && <SelectionModal onClose={closeModal}/>}
      </header>
    </div>
  );
}

export default Home;
