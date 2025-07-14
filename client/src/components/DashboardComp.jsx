import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/getusers?limit=5');
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getposts?limit=5');
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comment/getcomments?limit=5');
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser?.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  return (
    <div className='p-3 md:mx-auto'>
      {/* Top Summary Stats */}
      <div className='flex flex-wrap gap-4 justify-center'>
        <div className='flex flex-col p-4 dark:bg-slate-800 bg-white gap-4 w-full sm:w-72 rounded-md shadow'>
          <div className='flex justify-between items-center'>
            <div>
              <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
              <p className='text-2xl'>{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>

        <div className='flex flex-col p-4 dark:bg-slate-800 bg-white gap-4 w-full sm:w-72 rounded-md shadow'>
          <div className='flex justify-between items-center'>
            <div>
              <h3 className='text-gray-500 text-md uppercase'>Total Comments</h3>
              <p className='text-2xl'>{totalComments}</p>
            </div>
            <HiAnnotation className='bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>

        <div className='flex flex-col p-4 dark:bg-slate-800 bg-white gap-4 w-full sm:w-72 rounded-md shadow'>
          <div className='flex justify-between items-center'>
            <div>
              <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
              <p className='text-2xl'>{totalPosts}</p>
            </div>
            <HiDocumentText className='bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>
      </div>

      {/* Recent Tables */}
      <div className='flex flex-wrap gap-4 py-6 mx-auto justify-center'>
        {/* Recent Users Table */}
        <div className='flex flex-col w-full md:w-auto shadow-md p-4 rounded-md dark:bg-gray-800 bg-white'>
          <div className='flex justify-between mb-4 text-sm font-semibold'>
            <h1 className='text-lg'>Recent Users</h1>
            <Link to='/dashboard?tab=users'>
              <Button outline gradientDuoTone='purpleToPink'>See all</Button>
            </Link>
          </div>
          <div className='overflow-x-auto w-full'>
            <table className='min-w-full table-auto text-sm text-left text-gray-500 dark:text-gray-400'>
              <thead className='text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th className='px-6 py-3'>User image</th>
                  <th className='px-6 py-3'>Username</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                    <td className='px-6 py-2'>
                      <img src={user.profilePicture} alt='user' className='w-10 h-10 rounded-full' />
                    </td>
                    <td className='px-6 py-2'>{user.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Comments Table */}
        <div className='flex flex-col w-full md:w-auto shadow-md p-4 rounded-md dark:bg-gray-800 bg-white'>
          <div className='flex justify-between mb-4 text-sm font-semibold'>
            <h1 className='text-lg'>Recent Comments</h1>
            <Link to='/dashboard?tab=comments'>
              <Button outline gradientDuoTone='purpleToPink'>See all</Button>
            </Link>
          </div>
          <div className='overflow-x-auto w-full'>
            <table className='min-w-full table-auto text-sm text-left text-gray-500 dark:text-gray-400'>
              <thead className='text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th className='px-6 py-3'>Content</th>
                  <th className='px-6 py-3'>Likes</th>
                </tr>
              </thead>
              <tbody>
                {comments.map(comment => (
                  <tr key={comment._id} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                    <td className='px-6 py-2 w-96 line-clamp-2'>{comment.content}</td>
                    <td className='px-6 py-2'>{comment.numberOfLikes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Posts Table */}
        <div className='flex flex-col w-full md:w-auto shadow-md p-4 rounded-md dark:bg-gray-800 bg-white'>
          <div className='flex justify-between mb-4 text-sm font-semibold'>
            <h1 className='text-lg'>Recent Posts</h1>
            <Link to='/dashboard?tab=posts'>
              <Button outline gradientDuoTone='purpleToPink'>See all</Button>
            </Link>
          </div>
          <div className='overflow-x-auto w-full'>
            <table className='min-w-full table-auto text-sm text-left text-gray-500 dark:text-gray-400'>
              <thead className='text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th className='px-6 py-3'>Post image</th>
                  <th className='px-6 py-3'>Title</th>
                  <th className='px-6 py-3'>Category</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post._id} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                    <td className='px-6 py-2'>
                      <img src={post.image} alt='post' className='w-14 h-10 rounded-md' />
                    </td>
                    <td className='px-6 py-2 w-96'>{post.title}</td>
                    <td className='px-6 py-2 w-20'>{post.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
