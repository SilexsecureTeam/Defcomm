import React from "react";
import { useForm } from "react-hook-form";
import useComm from "../../hooks/useComm"; // Update with correct import path
import { onSuccess } from "../../utils/notifications/OnSuccess";
import { onFailure } from "../../utils/notifications/OnFailure";

const CreateChannelForm = ({ setIsModalOpen }) => {
  const { createChannelMutation } = useComm();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await createChannelMutation.mutateAsync({
        ...data,
        frequency: "", // Always empty
      });

      setIsModalOpen(false);
      reset();
    } catch (err) {
      onFailure({ message: "Failed to create channel." });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 w-[80vw] text-black max-w-md"
    >
      <h3 className="text-xl font-semibold mb-4 text-oliveLight">
        Create Walkie Talkie Room
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Channel Name
        </label>
        <input
          {...register("name", { required: "Name is required" })}
          className="w-full px-4 py-2 border border-gray-300 rounded mt-1"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register("description", { required: "Description is required" })}
          className="w-full px-4 py-2 border border-gray-300 rounded mt-1"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded"
      >
        {isSubmitting ? "Creating..." : "Create Channel"}
      </button>
    </form>
  );
};

export default CreateChannelForm;
