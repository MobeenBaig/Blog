import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
  try {
    const res = await fetch(`/api/comment/getcomments`, {
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      setComments(data.comments || []);
      setLoading(false);
    } else {
      console.error('Failed to fetch comments:', data.message);
      setLoading(false);
    }
  } catch (error) {
    console.error('Error fetching comments:', error.message);
    setLoading(false);
  }
};

  useEffect(() => {
    fetchComments();
  }, [currentUser?._id]);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const confirmDelete = (commentId) => {
    setCommentIdToDelete(commentId);
    setShowModal(true);
  };

  const deleteComment = async () => {
  try {
    const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    });

    if (res.ok) {
      setComments((prev) => prev.filter((c) => c._id !== commentIdToDelete));
      setShowModal(false);
      setCommentIdToDelete('');
    } else {
      const err = await res.json();
      alert(err.message || 'Failed to delete comment');
    }
  } catch (error) {
    console.error('Error deleting comment:', error.message);
    alert('Error deleting comment');
  }
};


  const visibleComments = comments.slice(0, visibleCount);

  if (!currentUser?.isAdmin) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 font-semibold">
        Unauthorized: Admin access required.
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 border-none">
      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">Loading comments...</p>
      ) : comments.length > 0 ? (
        <>
          <div className="overflow-y-auto max-h-[600px]">
            <table className="w-full text-xs text-left text-gray-500 dark:text-gray-400">
              <thead>
  <tr>
    <th className="px-4 py-3">Created At</th>
    <th className="px-4 py-3">Updated At</th>
    <th className="px-4 py-3">Content</th>
    <th className="px-4 py-3">Likes</th>
    <th className="px-4 py-3">Post ID</th>
    <th className="px-4 py-3">User ID</th>
    <th className="px-4 py-3 text-center">Delete</th>
  </tr>
</thead>

              <tbody>
                {visibleComments.map((comment) => (
                  <tr key={comment._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
  <td className="px-4 py-3 whitespace-nowrap">
    {new Date(comment.createdAt).toLocaleDateString()}
  </td>
  <td className="px-4 py-3 whitespace-nowrap">
    {new Date(comment.updatedAt).toLocaleDateString()}
  </td>
  <td className="px-4 py-3 text-gray-800 dark:text-white">
    {comment.content || 'No content'}
  </td>
  <td className="px-4 py-3 text-center text-gray-800 dark:text-white">
    {comment.likes?.length || 0}
  </td>
  <td className="px-4 py-3 whitespace-nowrap text-gray-800 dark:text-white">
    {comment.postId || 'Unknown'}
  </td>
  <td className="px-4 py-3 whitespace-nowrap text-gray-800 dark:text-white">
    {comment.userId || 'Unknown'}
  </td>
  <td className="px-4 py-3 text-center">
    <span
      onClick={() => confirmDelete(comment._id)}
      className="text-red-500 hover:underline cursor-pointer"
    >
      Delete
    </span>
  </td>
</tr>

                ))}
              </tbody>
            </table>
          </div>

          {visibleCount < comments.length && (
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
        <p className="text-center text-gray-600 dark:text-gray-300">No comments found.</p>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-[90%] max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={deleteComment}
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
