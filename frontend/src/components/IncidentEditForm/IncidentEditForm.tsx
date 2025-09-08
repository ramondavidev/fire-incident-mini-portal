'use client';

import { useState, useEffect } from 'react';
import { INCIDENT_TYPES, Incident } from '@/types/incident';
import { useIncidents } from '@/hooks/useIncidents';
import {
  validateFile,
  validateFileCount,
  getFileInfo,
} from '@/utils/fileValidation';

interface IncidentEditFormProps {
  incident: Incident;
  onCancel: () => void;
  onUpdate: (updatedIncident: Incident) => void;
}

export default function IncidentEditForm({
  incident,
  onCancel,
  onUpdate,
}: IncidentEditFormProps) {
  const { updateIncident } = useIncidents();
  const [formData, setFormData] = useState({
    title: incident.title,
    description: incident.description || '',
    incident_type: incident.incident_type,
    location: incident.location || '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fileValidationError, setFileValidationError] = useState('');
  const [fileInfo, setFileInfo] = useState<ReturnType<
    typeof getFileInfo
  > | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileValidationError('');
    setFileInfo(null);

    if (!file) {
      setImage(null);
      return;
    }

    // Validate file count (should be 1 for single file input)
    const countValidation = validateFileCount([file], 1);
    if (!countValidation.isValid) {
      setFileValidationError(
        countValidation.error || 'File count validation failed'
      );
      return;
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      setFileValidationError(validation.error || 'File validation failed');
      return;
    }

    // File is valid
    setImage(file);
    setFileInfo(getFileInfo(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFileValidationError('');

    if (!formData.title.trim() || !formData.incident_type) {
      setError('Title and incident type are required');
      return;
    }

    // Additional file validation before submit
    if (image) {
      const validation = validateFile(image);
      if (!validation.isValid) {
        setFileValidationError(validation.error || 'Invalid file');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const updatedIncident = await updateIncident({
        id: incident.id,
        title: formData.title,
        description: formData.description,
        incident_type: formData.incident_type,
        location: formData.location,
        image: image || undefined,
      });

      onUpdate(updatedIncident);
    } catch (error) {
      setError('Failed to update incident. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border-2 border-blue-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Edit Incident</h3>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          title="Cancel editing"
        >
          ×
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {fileValidationError && (
        <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded mb-4">
          <strong>File Error:</strong> {fileValidationError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="edit-title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title *
          </label>
          <input
            type="text"
            id="edit-title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="edit-incident_type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Incident Type *
          </label>
          <select
            id="edit-incident_type"
            name="incident_type"
            value={formData.incident_type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select incident type</option>
            {INCIDENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="edit-description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="edit-description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="edit-location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location
          </label>
          <input
            type="text"
            id="edit-location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="edit-image"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Update Image
          </label>
          <input
            type="file"
            id="edit-image"
            accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-2 text-sm text-gray-600">
            <p>• Allowed types: JPEG, PNG, GIF</p>
            <p>• Maximum size: 10MB</p>
          </div>
          {incident.image && (
            <p className="text-sm text-gray-500 mt-1">
              Current image: {incident.image.split('/').pop()}
            </p>
          )}
          {fileInfo && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                <strong>✓ New file selected:</strong> {fileInfo.name}
              </p>
              <p className="text-xs text-green-600">
                Size: {fileInfo.sizeFormatted} | Type: {fileInfo.type}
              </p>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-2 px-4 rounded-md font-medium ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            } text-white transition duration-200`}
          >
            {isSubmitting ? 'Updating...' : 'Update Incident'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
