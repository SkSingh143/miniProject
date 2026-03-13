import React, { useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { API_ENDPOINTS } from '../../api/endpoints';
import InputField from '../../components/forms/InputField';
import Button from '../../components/common/Button';
import { ToastContext } from '../../context/ToastContext';

const CreatePrescription = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useContext(ToastContext);

  const appointmentId = searchParams.get('aptId');
  const patientId = searchParams.get('patientId');

  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', duration: '' }]);
  const [notes, setNotes] = useState('');

  // Add a new medicine row
  const addMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', duration: '' }]);
  };

  // Handle changes in medicine inputs
  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...medicines];
    newMedicines[index][field] = value;
    setMedicines(newMedicines);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post(API_ENDPOINTS.DOCTOR.PRESCRIPTIONS, {
        appointmentId,
        patientId,
        diagnosis,
        medicines,
        notes
      });
      addToast('Prescription saved successfully', 'success');
      navigate('/doctor/appointments');
    } catch (error) {
      addToast('Failed to save prescription', 'error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Create Prescription</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
          <textarea 
            className="w-full mt-1 p-2 border rounded" 
            rows="3"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            required
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Medicines</h3>
          {medicines.map((med, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
              <input 
                placeholder="Medicine Name" 
                className="p-2 border rounded"
                value={med.name}
                onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                required
              />
              <input 
                placeholder="Dosage (e.g. 1-0-1)" 
                className="p-2 border rounded"
                value={med.dosage}
                onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                required
              />
              <input 
                placeholder="Duration (e.g. 5 days)" 
                className="p-2 border rounded"
                value={med.duration}
                onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                required
              />
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addMedicine} className="mt-2 text-sm">
            + Add Medicine
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
          <textarea 
            className="w-full mt-1 p-2 border rounded" 
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full">Save & Issue Prescription</Button>
      </form>
    </div>
  );
};

export default CreatePrescription;