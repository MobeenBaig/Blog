import { Navbar, TextInput , Button , DropdownHeader , DropdownDivider , DropdownItem , NavbarCollapse , NavbarLink , NavbarToggle, Dropdown, Avatar } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Navbar className='border-b-2'>
      <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
      >
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
          Mobeen's
        </span>
        Blog
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className='lg:hidden bg-gray-100 text-black hover:bg-slate-50 outline-none '  pill>
              <AiOutlineSearch/>
            </Button>
      
            <div className=' flex gap-3 items-center md:order-2'>
              <Button  className='hidden sm:inline bg-gray-100 text-black hover:bg-slate-50 outline-none dark:bg-orange-400 dark:hover:bg-orange-300 'pill onClick={()=>{
                dispatch(toggleTheme())
              }} >
                {theme === 'light' ? <FaSun/>:<FaMoon/>}
                 
              </Button>
      
              {currentUser ? (
                <Dropdown arrowIcon={false} inline label={<Avatar alt='user' img={currentUser.profilePicture} rounded/>}>
                  <div className="px-4 py-2 text-sm cursor-pointer">
                    <div className="font-semibold">{currentUser.username}</div>
                    <div className="text-gray-500 truncate">{currentUser.email}</div>
                  </div>
                  <Link to ={'/dashboard?tab=profile'}>
                  <div className='px-4 py-1 hover:bg-slate-400'>Profile</div>
                  </Link>
                  <div className='px-4 py-1  hover:bg-slate-400 cursor-pointer' onClick={handleSignout}>Sign out</div>
                </Dropdown>
              ):(
                <Link to={'/sign-in'}>
      
             
                <Button className="bg-white-600 text-black hover:bg-purple-500 outline outline-purple-500 hover:text-white dark:bg-orange-400 dark:hover:bg-orange-300 dark:outline-orange-500 " >
                  Sign In
                </Button>
                
                </Link>
              )}
              
              
              <NavbarToggle/>
            </div>
      <NavbarCollapse>
        <NavbarLink active={path === '/'} as={'div'}>
          <Link to='/'>Home</Link>
        </NavbarLink>
        <NavbarLink active={path === '/about'} as={'div'}>
          <Link to='/about'>About</Link>
        </NavbarLink>
        <NavbarLink active={path === '/projects'} as={'div'}>
          <Link to='/projects'>Projects</Link>
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}