import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import useDrive from "../../hooks/useDrive";

// Helper to sanitize input
const sanitize = (value) => DOMPurify.sanitize(value.trim());

const CreateFolderForm = ({ onClose, folder }) => {
  const [form, setForm] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState({});
  const { createFolderMutation, updateFolderMutation } = useDrive();

  useEffect(() => {
    if (folder) {
      setForm({
        name: folder.name || "",
        description: folder.description || "",
      });
    }
  }, [folder]);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = "Folder name is required.";
    } else if (form.name.length > 100) {
      newErrors.name = "Folder name is too long.";
    }
    if (form.description.length > 300) {
      newErrors.description = "Description must be under 300 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const sanitizedForm = {
      name: sanitize(form.name),
      description: sanitize(form.description),
    };

    const mutation = folder ? updateFolderMutation : createFolderMutation;
    const payload = folder ? { ...sanitizedForm, id: folder.id } : sanitizedForm;

    mutation.mutate(payload, {
      onSuccess: () => {
        setForm({ name: "", description: "" });
        onClose();
      },
    });
  };

  const isSubmitting = folder
    ? updateFolderMutation.isPending
    : createFolderMutation.isPending;

  const actionLabel = folder
    ? isSubmitting ? "Updating..." : "Update Folder"
    : isSubmitting ? "Creating..." : "Create Folder";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Folder Name
        </label>
        <input
          type="text"
          required
          value={form.name}
          onChange={handleChange("name")}
          placeholder="Enter folder name"
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
            errors.name ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-indigo-500"
          }`}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={handleChange("description")}
          placeholder="Optional description"
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
            errors.description ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-indigo-500"
          }`}
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {actionLabel}
        </button>
      </div>
    </form>
  );
};

export default CreateFolderForm;
