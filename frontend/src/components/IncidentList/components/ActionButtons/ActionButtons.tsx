import React, { memo } from 'react';
import { EditIcon, DeleteIcon } from '../Icons';

interface ActionButtonsProps {
  onView?: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
  isDeleting: boolean;
}

// View Button Component
interface ViewButtonProps {
  onView: () => void;
}

export const ViewButton = memo<ViewButtonProps>(({ onView }) => (
  <button
    onClick={onView}
    aria-label="View details"
    className="inline-flex items-center px-3 py-1.5 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md mr-2"
  >
    <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      <path
        fillRule="evenodd"
        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
        clipRule="evenodd"
      />
    </svg>
    View
  </button>
));

ViewButton.displayName = 'ViewButton';

// Edit Button Component
interface EditButtonProps {
  onEdit: () => void;
  isEditing: boolean;
}

export const EditButton = memo<EditButtonProps>(({ onEdit, isEditing }) => (
  <button
    onClick={onEdit}
    disabled={isEditing}
    aria-label="Edit incident"
    className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md mr-2"
  >
    {isEditing ? (
      <>
        <EditIcon className="animate-pulse w-3 h-3 mr-1.5" />
        Editing...
      </>
    ) : (
      <>
        <EditIcon className="w-3 h-3 mr-1.5" />
        Edit
      </>
    )}
  </button>
));

EditButton.displayName = 'EditButton';

// Delete Button Component
interface DeleteButtonProps {
  onDelete: () => void;
  isDeleting: boolean;
}

export const DeleteButton = memo<DeleteButtonProps>(
  ({ onDelete, isDeleting }) => (
    <button
      onClick={onDelete}
      disabled={isDeleting}
      aria-label="Delete incident"
      className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
    >
      {isDeleting ? (
        <>
          <svg
            className="animate-spin w-3 h-3 mr-1.5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Deleting...
        </>
      ) : (
        <>
          <DeleteIcon className="w-3 h-3 mr-1.5" />
          Delete
        </>
      )}
    </button>
  )
);

DeleteButton.displayName = 'DeleteButton';

// Combined Action Buttons Component
const ActionButtons = memo<ActionButtonsProps>(
  ({ onView, onEdit, onDelete, isEditing, isDeleting }) => (
    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
      {onView && <ViewButton onView={onView} />}
      <EditButton onEdit={onEdit} isEditing={isEditing} />
      <DeleteButton onDelete={onDelete} isDeleting={isDeleting} />
    </div>
  )
);

ActionButtons.displayName = 'ActionButtons';

export default ActionButtons;
