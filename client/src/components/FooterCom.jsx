import React from 'react'
import { Footer, FooterCopyright, FooterDivider } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { BsFacebook , BsInstagram , BsGithub , BsTwitterX  } from 'react-icons/bs'
const FooterCom = () => {
  return (
    
     <Footer container className='border border-t-8 border-teal-500'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
          <div className='mt-3'>
          <Link to="/">
        <span className="px-2 text-white text-lg sm:text-xl bg-gradient-to-r 
         from-indigo-500 via-purple-500 to-pink-500 rounded-md">
          Mobeen's
        </span>
        Blog
      </Link>
          </div>
              <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6 '>
                <div>
                <p>About</p>
                  <div>
                    <a href="/about" target='_blank' rel='nooopener noreferrer'>
                    <p className='  hover:underline mt-2'>100 Js Projects</p>
                    <p className='mt-2'>Home</p>
                    </a>
                 </div>
              </div>



              <div>
                <p>Discord</p>
                  <div>
                    <a href="/about" target='_blank' rel='nooopener noreferrer'>
                    <p className='  hover:underline mt-2'>100 Js Projects</p>
                    <p className='mt-2'>mobeen's blog</p>
                    </a>
                 </div>
              </div>

              <div>
                <p>Legal</p>
                  <div>
                    <a href="/about" target='_blank' rel='nooopener noreferrer'>
                    <p className='  hover:underline mt-2'>Privacy Policy</p>
                    <p className='mt-2'>Term's & Conditions</p>
                    </a>
                 </div>
              </div>
              
         
          </div>
        </div>
        <FooterDivider/>
        <div className='w-full sm:flex sm:items-center sm:justify-between '>
        <FooterCopyright href='#' className='justify-start flex' by='Mobeen' year={new Date ().getFullYear()} />
        <div className='flex gap-6 sm:mt-0 mt-4 sm:justify-center'>
        <BsFacebook></BsFacebook>
        <BsInstagram></BsInstagram>
        <BsTwitterX></BsTwitterX>
        <BsGithub></BsGithub>
        </div>
        </div>
      </div>
     </Footer>
    
  )
}

export default FooterCom
