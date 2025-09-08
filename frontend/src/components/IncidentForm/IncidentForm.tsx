'use client';

import { useState, useCallback, memo } from 'react';
import { INCIDENT_TYPES } from '@/types/incident';
import { useIncidents } from '@/hooks/useIncidents';
import {
  validateFile,
  validateFileCount,
  getFileInfo,
} from '@/utils/fileValidation';

interface IncidentFormProps {
  onIncidentCreated: () => void;
}

// Memoized form field component to prevent unnecessary re-renders
const FormField = memo(
  ({
    label,
    id,
    type = 'text',
    value,
    onChange,
    required = false,
    children,
    className = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500',
  }: {
    label: string;
    id: string;
    type?: string;
    value?: string;
    onChange?: (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => void;
    required?: boolean;
    children?: React.ReactNode;
    className?: string;
  }) => (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && '*'}
      </label>
      {children || (
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className={className}
          required={required}
        />
      )}
    </div>
  )
);
FormField.displayName = 'FormField';

export default function IncidentForm({ onIncidentCreated }: IncidentFormProps) {
  const { createIncident } = useIncidents();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    incident_type: '',
    location: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fileValidationError, setFileValidationError] = useState('');
  const [fileInfo, setFileInfo] = useState<ReturnType<
    typeof getFileInfo
  > | null>(null);

  // Memoized input change handler
  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  // Memoized image change handler with validation
  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    []
  );

  // Memoized form submit handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
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
        await createIncident({
          title: formData.title,
          description: formData.description,
          incident_type: formData.incident_type,
          location: formData.location,
          image: image || undefined,
        });

        // Reset form
        setFormData({
          title: '',
          description: '',
          incident_type: '',
          location: '',
        });
        setImage(null);
        setFileInfo(null);
        setFileValidationError('');

        // Reset file input
        const fileInput = document.querySelector(
          'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = '';

        onIncidentCreated();
      } catch (error) {
        // Error is now handled by the toast system in useIncidents
        // No need to set local error state for API errors
        console.error('Failed to create incident:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, image, createIncident, onIncidentCreated]
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Report New Incident
      </h2>

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
        <FormField
          label="Title"
          id="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />

        <FormField label="Incident Type" id="incident_type" required>
          <select
            id="incident_type"
            name="incident_type"
            value={formData.incident_type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          >
            <option value="">Select incident type</option>
            {INCIDENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Description" id="description">
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </FormField>

        <FormField
          label="Location"
          id="location"
          value={formData.location}
          onChange={handleInputChange}
        />

        <FormField label="Image" id="image" type="file">
          <input
            type="file"
            id="image"
            accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <div className="mt-2 text-sm text-gray-600">
            <p>• Allowed types: JPEG, PNG, GIF</p>
            <p>• Maximum size: 10MB</p>
          </div>
          {fileInfo && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                <strong>✓ File selected:</strong> {fileInfo.name}
              </p>
              <p className="text-xs text-green-600">
                Size: {fileInfo.sizeFormatted} | Type: {fileInfo.type}
              </p>
            </div>
          )}
        </FormField>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md font-medium ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'
          } text-white transition duration-200`}
        >
          {isSubmitting ? 'Creating...' : 'Create Incident'}
        </button>
      </form>
    </div>
  );
}
