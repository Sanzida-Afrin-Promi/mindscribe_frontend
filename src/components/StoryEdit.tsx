import SuccessPopup from "../components/SuccessPopUp";
import WriteTextEditor from "../components/WriteTextEditor";
import { useStoryEditLogic } from "../hooks/useStoryEditLogic";

const StoryEdit = () => {
  const {
    story,
    title,
    setTitle,
    description,
    setDescription,
    error,
    showSuccess,
    setShowSuccess,
    handleUpdate,
  } = useStoryEditLogic();

  if (error) return <p className="text-red-500">{error}</p>;
  if (!story) return <p className="text-gray-500">Loading story...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center py-8 bg-gray-100">
      {showSuccess && (
        <SuccessPopup
          message="Story updated successfully!"
          onClose={() => setShowSuccess(false)}
        />
      )}

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-4">Edit Story</h1>

        <form onSubmit={handleUpdate} className="w-full flex flex-col gap-6">
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl"
            placeholder="Story Title"
            required
          />

          <div className="h-[450px] w-full">
            <WriteTextEditor value={description} onChange={setDescription} />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
              Update Story
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoryEdit;
