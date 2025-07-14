import React, { useEffect, useState } from 'react';
import { Sidebar } from 'flowbite-react';
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function DashSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      {currentUser && currentUser.isAdmin && (
        <Link to="/dashboard?tab=dash">
          <div
            className={`flex items-center gap-2 p-1 rounded-md cursor-pointer
          ${
            tab === 'dash' || !tab
              ? 'bg-gray-200 dark:bg-gray-700 font-semibold text-gray-900 dark:text-white'
              : 'hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
          }`}
          >
            <HiChartPie className="text-xl" />
            <span>Dashboard</span>
          </div>
        </Link>
      )}

      <Link to={'/dashboard?tab=profile'}>
        <div
          className={`flex items-center gap-3 py-1 rounded-md px-1 hover:bg-slate-200 hover:dark:bg-zinc-600 ${
            tab === 'profile' ? 'bg-zinc-200 dark:bg-zinc-600' : ''
          }`}
        >
          <div className="flex-shrink-0">
            <HiUser size={20} />
          </div>
          <p>Profile</p>
          <p className="bg-zinc-800 px-2 rounded-md ml-auto text-white">
            {currentUser.isAdmin ? 'Admin' : 'User'}
          </p>
        </div>
      </Link>

      {/* POSTS */}
      <div
        onClick={() =>
          currentUser.isAdmin
            ? navigate('/dashboard?tab=posts')
            : navigate('/')
        }
        className={`flex items-center gap-3 py-1 rounded-md px-1 hover:bg-slate-200 hover:dark:bg-zinc-600 mt-2 cursor-pointer ${
          tab === 'posts' ? 'bg-zinc-200 dark:bg-zinc-600' : ''
        }`}
      >
        <HiDocumentText />
        <p>Posts</p>
      </div>

      {/* USERS */}
      <div
        onClick={() =>
          currentUser.isAdmin
            ? navigate('/dashboard?tab=users')
            : navigate('/')
        }
        className={`flex items-center gap-3 py-1 rounded-md px-1 hover:bg-slate-200 hover:dark:bg-zinc-600 mt-2 cursor-pointer ${
          tab === 'users' ? 'bg-zinc-200 dark:bg-zinc-600' : ''
        }`}
      >
        <HiOutlineUserGroup />
        <p>Users</p>
      </div>

      {/* COMMENTS */}
      <div
        onClick={() =>
          currentUser.isAdmin
            ? navigate('/dashboard?tab=comments')
            : navigate('/')
        }
        className={`flex items-center gap-3 py-1 rounded-md px-1 hover:bg-slate-200 hover:dark:bg-zinc-600 mt-2 cursor-pointer ${
          tab === 'comments' ? 'bg-zinc-200 dark:bg-zinc-600' : ''
        }`}
      >
        <HiAnnotation />
        <p>Comments</p>
      </div>

      {/* SIGN OUT */}
      <div
        onClick={handleSignOut}
        className="flex items-center gap-3 hover:bg-slate-200 hover:dark:bg-zinc-600 py-1 rounded-md px-1 mt-2 cursor-pointer"
      >
        <div className="flex-shrink-0">
          <HiArrowSmRight size={20} />
        </div>
        <p>Sign Out</p>
      </div>
    </Sidebar>
  );
}
