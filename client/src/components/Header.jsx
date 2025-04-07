import { Navbar, TextInput , Button} from 'flowbite-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon } from 'react-icons/fa';
function Header() {
  return (
    <Navbar className="border-b-2 ">
      <Link to="/">
        <span className="px-2 text-white text-sm sm:text-lg bg-gradient-to-r 
         from-indigo-500 via-purple-500 to-pink-500 rounded-md">
          Mobeen's
        </span>
        Blog
      </Link>
      <form>
    
        <TextInput 
          type="text" 
          placeholder="Search..." 
          rightIcon = {AiOutlineSearch}
          className='hidden lg:inline'
        />
         
      </form>
      <Button className='lg:hidden  ' color="gray" pill>
        <AiOutlineSearch/>
      </Button>

      <div className=' flex'>
        <Button className='hidden sm:inline  'color = 'gray' pill >
            <FaMoon />

            
        </Button>
      </div>
       
    </Navbar>
  );
}

export default Header;
