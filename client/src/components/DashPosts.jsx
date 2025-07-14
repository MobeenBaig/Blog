import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [showModal, setShowModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ loading state

  const fetchPosts = async () => {
    setLoading(true); // start loading
    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&limit=1000`);
      const data = await res.json();
      if (res.ok) {
        setUserPosts(data.posts);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false); // end loading
    }
  };

  useEffect(() => {
    if (currentUser.isAdmin) {
      fetchPosts();
    } else {
      setLoading(false);
    }
  }, [currentUser._id, currentUser.isAdmin]);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const confirmDelete = (postId) => {
    setPostToDelete(postId);
    setShowModal(true);
  };

  const deletePost = async () => {
    try {
      const res = await fetch(`/api/post/deletepost/${postToDelete}/${currentUser._id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setUserPosts((prev) => prev.filter((post) => post._id !== postToDelete));
        setShowModal(false);
        setPostToDelete(null);
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to delete post');
      }
    } catch (error) {
      console.error(error.message);
      alert('Error deleting post');
    }
  };

  const visiblePosts = userPosts.slice(0, visibleCount);

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 border-none">
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
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
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      ) : currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <div className="overflow-y-auto max-h-[600px]">
            <table className="w-full text-xs text-left text-gray-500 dark:text-gray-400">
              <thead className="text-[11px] text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Delete</th>
                  <th className="px-4 py-3">Edit</th>
                </tr>
              </thead>
              <tbody>
                {visiblePosts.map((post) => (
                  <tr
                    key={post._id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-4 py-3">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/post/${post.slug}`}>
                        <img
                          src={
                            post.image ||
                            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEbJ98lSmCfnL6i6ne8O8yRG5xOh8n8Ohv7g&s'
                          }
                          alt={post.title}
                          className="w-20 h-12 object-cover bg-gray-500"
                        />
                      </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link
                        className="font-medium text-gray-900 dark:text-white"
                        to={`/post/${post.slug}`}
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{post.category}</td>
                    <td
                      onClick={() => confirmDelete(post._id)}
                      className="px-4 py-3 text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        className="text-teal-500 hover:underline"
                        to={`/update-post/${post._id}`}
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {visibleCount < userPosts.length && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleShowMore}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow"
              >
                Show More
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No posts found!
        </p>
      )}

      {/* 🔥 Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-[90%] max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={deletePost}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
