import { useState } from 'react'
import './App.css'
import FileUploader from './FileUploader'
import Report from './Report'
import Modal from './Modal'

function App() {

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <h1 className='title'> Report Summary </h1>
      <FileUploader setLoading={setLoading} loading={loading} openModal={openModal} setData={setData} data={data} />
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <Report data={data} loading={loading} />
      </Modal>
    </>
  )
}

export default App
