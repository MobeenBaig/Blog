import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized',
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        searchTerm: searchTermFromUrl || '',
        sort: sortFromUrl || 'desc',
        category: categoryFromUrl || 'uncategorized',
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setShowMore(data.posts.length === 9);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const res = await fetch(`/api/post/getposts?${urlParams.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setShowMore(data.posts.length === 9);
    }
  };

  return (
    <div className='flex flex-col md:flex-row'>
      {/* Sidebar Filters */}
      <div className='p-5 border-b md:border-b-0 md:border-r border-gray-300 dark:border-gray-600 md:min-h-screen w-full md:w-80'>
        <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label className='font-semibold'>Search Term</label>
            <TextInput
              id='searchTerm'
              placeholder='Search...'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='font-semibold'>Sort</label>
            <Select id='sort' value={sidebarData.sort} onChange={handleChange}>
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>
          <div className='flex flex-col gap-1'>
            <label className='font-semibold'>Category</label>
            <Select id='category' value={sidebarData.category} onChange={handleChange}>
              <option value='uncategorized'>Uncategorized</option>
              <option value='reactjs'>React.js</option>
              <option value='nextjs'>Next.js</option>
              <option value='javascript'>JavaScript</option>
            </Select>
          </div>
          <Button type='submit' gradientDuoTone='purpleToPink' outline>
            Apply Filters
          </Button>
        </form>
      </div>

      {/* Main Post Results */}
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b border-gray-300 dark:border-gray-600 p-4'>
          Posts Results:
        </h1>
        <div className='p-6 flex flex-wrap gap-4'>
          {loading && <p className='text-xl text-gray-500'>Loading...</p>}
          {!loading && posts.length === 0 && (
            <p className='text-xl text-gray-500'>No posts found.</p>
          )}
          {!loading &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
        {showMore && (
          <div className='w-full flex justify-center pb-10'>
            <button
              onClick={handleShowMore}
              className='text-teal-600 font-medium hover:underline'
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
