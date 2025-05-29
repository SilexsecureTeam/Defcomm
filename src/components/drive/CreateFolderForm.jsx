import { useState } from "react";
import useDrive from "../../hooks/useDrive";

const CreateFolderForm = ({ onClose }) => {
  const [form, setForm] = useState({ name: "", description: "" });
  const { createFolderMutation } = useDrive();

  const handleSubmit = (e) => {
    e.preventDefault();
    createFolderMutation.mutate(form, {
      onSuccess: () => {
        onClose();
        setForm({ name: "", description: "" });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={createFolderMutation.isPending}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createFolderMutation.isPending ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
};

export default CreateFolderForm;
