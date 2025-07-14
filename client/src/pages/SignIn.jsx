
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link , useNavigate} from 'react-router-dom'
import { signInStart , signInFailure , signInSuccess } from '../redux/user/userSlice'
import {useDispatch , useSelector} from 'react-redux'
import OAuth from '../components/OAuth'

const SignIn = () => {

  const [formData , setFormData] = useState({})
  // const [errorMessage , setErrorMessage] = useState(null)
  // const [loading , setLoading] = useState(false)
  const {loading, error: errorMessage} = useSelector(state => state.user)
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const handleSubmit = async (e)=>{
    e.preventDefault()
    if(!formData.email || !formData.password){
      return dispatch(signInFailure('Please fill out all fields.'))
    }
    try {
     dispatch(signInStart())
      const res = await fetch ('/api/auth/signin',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),

      })
      const data = await res.json()
      if(data.success === false){
        dispatch(signInFailure(data.message))
      }
      
      if(res.ok){
        dispatch(signInSuccess(data))
        navigate('/')
      }
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }
  const handleChange = (e)=>{
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  }
  console.log(formData)
  return (
    <div className='min-h-screen mt-20 gap-5'>
      <div className='flex max-w-3xl mx-auto flex-col md:flex-row md:items-center'>
        {/* left */}
        <div className='flex-1'>
           <Link to="/" className='font-bold  dark:text-white text-4'>
                  <span className="  px-2 text-white text-sm sm:text-lg bg-gradient-to-r 
                   from-indigo-500 via-purple-500 to-pink-500 rounded-md">
                    Mobeen's
                  </span>
                  Blog
                </Link>
                <p className='text-sm mt-5 '>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
        </div>
        {/* right */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            
           

              <label for="email">Your Email</label>
              <TextInput type='email' placeholder='Email' id='email' onChange={handleChange}></TextInput>

              <label for="password">Your Password</label>
              <TextInput type='password' placeholder='********' id='password' onChange={handleChange}></TextInput>

              <Button className='bg-purple-500 bg-gradient-to-r from-purple-500 to-pink-500  
              ' type='submit' disabled={loading}>{loading ? (
                <>
                <Spinner  size='sm' />
                <span className='pl-3'>...Loading</span>
                </>
              ) : 'Sign In' }</Button>

              <OAuth>
                
              </OAuth>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
          <span>Don't Have an account?</span>
          <Link to='/sign-up' className='text-blue-500'>Sign Up</Link>
          </div>
         {errorMessage &&(
          <Alert className='mt-5' color='failure'>
            {errorMessage}
          </Alert>
         )
         }
        </div>
      </div>
      
    </div>
  )
}

export default SignIn
