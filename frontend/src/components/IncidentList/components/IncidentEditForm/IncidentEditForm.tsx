import React, { useState, useCallback, memo } from 'react';
import { EditIcon, CheckIcon, CloseIcon } from '../Icons';

interface IncidentFormData {
  title: string;
  description: string;
  incident_type: string;
  location: string;
}

interface IncidentEditFormProps {
  initialData: IncidentFormData;
  onSave: (data: IncidentFormData, image: File | null) => void;
  onCancel: () => void;
}

const IncidentEditForm = memo<IncidentEditFormProps>(
  ({ initialData, onSave, onCancel }) => {
    const [editData, setEditData] = useState<IncidentFormData>(initialData);
    const [editImage, setEditImage] = useState<File | null>(null);

    const handleInputChange = useCallback(
      (field: keyof IncidentFormData, value: string) => {
        setEditData((prev) => ({ ...prev, [field]: value }));
      },
      []
    );

    const handleImageChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setEditImage(file || null);
      },
      []
    );

    const handleSave = useCallback(() => {
      onSave(editData, editImage);
    }, [editData, editImage, onSave]);

    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="space-y-4">
          {/* Form Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <EditIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Edit Incident
            </h3>
          </div>

          {/* Title Field */}
          <div>
            <label
              htmlFor="edit-title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title
            </label>
            <input
              id="edit-title"
              type="text"
              value={editData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              placeholder="Enter incident title"
            />
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor="edit-description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="edit-description"
              value={editData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              placeholder="Describe the incident"
            />
          </div>

          {/* Incident Type Field */}
          <div>
            <label
              htmlFor="edit-incident-type"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Incident Type
            </label>
            <select
              id="edit-incident-type"
              value={editData.incident_type}
              onChange={(e) =>
                handleInputChange('incident_type', e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            >
              <option value="Structure Fire">Structure Fire</option>
              <option value="Vehicle Fire">Vehicle Fire</option>
              <option value="Wildfire">Wildfire</option>
              <option value="Electrical Fire">Electrical Fire</option>
              <option value="Chemical Fire">Chemical Fire</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Location Field */}
          <div>
            <label
              htmlFor="edit-location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Location
            </label>
            <input
              id="edit-location"
              type="text"
              value={editData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              placeholder="Enter incident location"
            />
          </div>

          {/* Image Upload Field */}
          <div>
            <label
              htmlFor="edit-image"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Image (optional)
            </label>
            <input
              id="edit-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            />
            {editImage && (
              <p className="text-sm text-gray-600 mt-2 flex items-center">
                <CheckIcon className="w-4 h-4 mr-1 text-green-600" />
                New image selected: {editImage.name}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm hover:shadow-md"
            >
              <CheckIcon className="w-4 h-4 mr-2" />
              Save Changes
            </button>
            <button
              onClick={onCancel}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-sm hover:shadow-md"
            >
              <CloseIcon className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
);

IncidentEditForm.displayName = 'IncidentEditForm';

export default IncidentEditForm;
export type { IncidentFormData };
