import { Button, Modal, ModalBody, ModalHeader, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import { updateStart, updateSuccess, updateFailure , deleteUserFailure , deleteUserSuccess , deleteUserStart , signoutSuccess} from '../redux/user/userSlice'
import { Link } from 'react-router-dom'

export default function DashProfile() {
  const { currentUser , loading } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(currentUser.profilePicture || '')
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [showModal , setShowModal] = useState(false)
  const filePickerRef = useRef()

  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!validTypes.includes(file.type)) {
        setError('Only JPG, PNG or GIF allowed')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB')
        return
      }

      setImageFile(file)
      setImageFileUrl(URL.createObjectURL(file))
      setError('')
    }
  }

  // ✅ Upload image only when a new file is selected
  useEffect(() => {
    if (imageFile) {
      uploadImage()
    }
  }, [imageFile])
  

  // ✅ Reset image URL and clean up blob on mount/unmount
  useEffect(() => {
    if (imageFileUrl?.startsWith('blob:') && !imageFile) {
      setImageFileUrl(currentUser.profilePicture || '/default-profile.jpg')
    }
  

    return () => {
      if (imageFileUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(imageFileUrl)
      }
    }
  }, []) // Run only on mount/unmount

  const uploadImage = async () => {
    const data = new FormData()
    data.append('file', imageFile)
    data.append('upload_preset', 'mern-blog')

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dfrogykwf/image/upload', {
        method: 'POST',
        body: data,
      })

      const result = await res.json()
      if (!res.ok) {
        throw new Error(result.error?.message || 'Image upload failed')
      }

      setImageFileUrl(result.secure_url)
    } catch (err) {
      console.error('Upload error:', err)
      setError(`Upload failed: ${err.message}`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(updateStart())
    setSuccessMsg('')
    setError('')

    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}` // if token is stored here
        },
        body: JSON.stringify({
          ...formData,
          profilePicture: imageFileUrl
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Something went wrong')
        dispatch(updateFailure(data))
        return
      }

      dispatch(updateSuccess(data))
      setSuccessMsg('Profile updated successfully!')
    } catch (err) {
      setError('Request failed. Try again later.')
      dispatch(updateFailure(err.message))
    }
  }

 

  const handleDeleteUser = async ()=>{
    setShowModal(false)
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method: 'DELETE',
      })
      const data = await res.json()
      if(!res){
        dispatch(deleteUserFailure(data.message))
      }
      else{
        dispatch(deleteUserSuccess(data))
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }
  const handleSignOut = async ()=>{
    try {
      const res = await fetch ('/api/user/signout',{
        method: 'POST',
      })
      const data = await res.json()
      if(!res.ok){
        console.log(data.message)
      } else{
        dispatch(signoutSuccess())
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>

      {error && <div className="text-red-500 text-center">{error}</div>}
      {successMsg && <div className="text-green-500 text-center">{successMsg}</div>}

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          accept='image/*'
          hidden
          ref={filePickerRef}
          onChange={handleImageChange}
        />

        <div
          onClick={() => filePickerRef.current.click()}
          className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
        >
          <img
            src={
              imageFileUrl?.startsWith('blob:')
                ? imageFileUrl
                : imageFileUrl || '/default-profile.jpg'
            }
            alt="profile"
            className='rounded-full w-full h-full border-8 border-green-400 object-cover'
          />
        </div>

        <TextInput
          id='username'
          type='text'
          placeholder='Username'
          value={formData.username}
          onChange={handleChange}
        />
        <TextInput
          id='email'
          type='email'
          placeholder='Email'
          value={formData.email}
          onChange={handleChange}
        />
        <TextInput
          id='password'
          type='password'
          placeholder='Password'
          value={formData.password}
          onChange={handleChange}
        />

        <Button disabled={loading}
          type='submit'
          color='green'
          outline
          className='hover:bg-gradient-to-r from-purple-500 to-blue-500'
        >
          {loading ? 'loading...' : 'Update'}
          
        </Button>
        {
          currentUser.isAdmin && (
            <Link to={'/create-post'}>
              
            <Button type='button' className='w-full' >
            
            Create a post
            </Button>
            </Link>
            
          )
        }
      </form>

      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer' onClick={()=>setShowModal(true)}>Delete Account</span>
        <span className='cursor-pointer' onClick={handleSignOut}>Sign Out</span>
      </div>

      <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
       
          <ModalHeader>
            <ModalBody>
              <div className="text-center ">
                <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto '>

                </HiOutlineExclamationCircle>
                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
                <div className='flex justify-center gap-4'>
                  <Button color='failure' onClick={handleDeleteUser}>
                    Yes, I'm sure
                  </Button>
                  <Button color = 'gray' onClick={()=> setShowModal(false)}>No, cancel</Button>
                </div>
              </div>
            </ModalBody>
          </ModalHeader>
        
      </Modal>
    </div>
  )
}
