import React, { useState } from 'react';
import axios from 'axios';
import { XCircle } from "lucide-react";

const ImportCustomersModal = ({ onClose }) => {
    const [file, setFile] = useState(null);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);


  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

   const handleImport = async () => {
      if (!file) {
         setError("Please select a CSV file.");
         return;
    }
      setError(null);
      setLoading(true);

        // Simulate an import
        setTimeout(() => {
            setLoading(false);
            onClose();
            alert("Simulated import completed! In a real app, data from CSV would be imported.");
        }, 1000);

    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Import Customers</h2>
                      <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1 rounded-full" aria-label="close modal">
                        <XCircle size={20} />
                      </button>
                  </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input
                    type="file"
                   accept=".csv"
                    onChange={handleFileChange}
                     className="border p-2 rounded mb-4"
                />
                 <div className="flex justify-end space-x-2">
                     <button onClick={handleImport} className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
                         {loading ? "Importing..." : "Import"}
                     </button>
                   <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded" disabled={loading}>
                        Cancel
                     </button>
               </div>
            </div>
        </div>
    );
};

export default ImportCustomersModal;
