import React, { useState } from 'react';

interface EditModalProps {
  financiamiento: any;
  onClose: () => void;
  onSave: (updatedFinanciamiento: any) => void;
}

const EditModal: React.FC<EditModalProps> = ({ financiamiento, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    monto: financiamiento.monto || '',
    fechaVencimiento: financiamiento.fechaVencimiento || '',
    numeroLetraCambio: financiamiento.numeroLetraCambio || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl mb-4">Editar Financiamiento</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Monto:</label>
            <input 
              type="number" 
              name="monto" 
              value={formData.monto} 
              onChange={handleChange} 
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label>Fecha de Vencimiento:</label>
            <input 
              type="date" 
              name="fechaVencimiento" 
              value={formData.fechaVencimiento} 
              onChange={handleChange} 
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label>N° Letra Cambio:</label>
            <input 
              type="text" 
              name="numeroLetraCambio" 
              value={formData.numeroLetraCambio} 
              onChange={handleChange} 
              className="border p-2 w-full"
            />
          </div>
          <div className="flex justify-between mt-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
            <button type="button" className="bg-red-500 text-white px-4 py-2 rounded" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
