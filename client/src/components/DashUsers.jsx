import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ loading state

  const fetchUsers = async () => {
    setLoading(true); // start loading
    try {
      const res = await fetch(`/api/user/getusers?startIndex=0&limit=1000`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error.message);
    } finally {
      setLoading(false); // end loading
    }
  };

  useEffect(() => {
    if (currentUser.isAdmin) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [currentUser._id]);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const confirmDelete = (userId) => {
    setUserToDelete(userId);
    setShowModal(true);
  };

  const deleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
        credentials: 'include',
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userToDelete));
        setShowModal(false);
        setUserToDelete(null);
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error(error.message);
      alert('Error deleting user');
    }
  };

  const visibleUsers = users.slice(0, visibleCount);

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
      ) : currentUser.isAdmin && users.length > 0 ? (
        <>
          <div className="overflow-y-auto max-h-[600px]">
            <table className="w-full text-xs text-left text-gray-500 dark:text-gray-400">
              <thead className="text-[11px] text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3">Date Created</th>
                  <th className="px-4 py-3">User Image</th>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3 text-center">Admin</th>
                  <th className="px-4 py-3 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {visibleUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <img
                        src={
                          user.profilePicture ||
                          'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                        }
                        alt="Profile"
                        className="w-12 h-12 object-cover rounded-full"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-800 dark:text-white">
                      {user.username}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {user.isAdmin ? 'yes' : 'no'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        onClick={() => confirmDelete(user._id)}
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

          {visibleCount < users.length && (
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
          No users found!
        </p>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-[90%] max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={deleteUser}
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
