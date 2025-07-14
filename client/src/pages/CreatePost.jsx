import { Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useNavigate } from 'react-router-dom'

export default function CreatePost() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('uncategorized')
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [imageUrl, setImageUrl] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' | 'error'

  const navigate = useNavigate()

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0])
    setUploadProgress(0)
    setImageUrl('')
    setMessage('')
  }

  const uploadImageToCloudinary = () => {
    return new Promise((resolve, reject) => {
      if (!imageFile) return resolve('')
      setUploading(true)
      setMessage('')
      const formData = new FormData()
      formData.append('file', imageFile)
      formData.append('upload_preset', 'mern-blog')
      formData.append('folder', `posts/${category}`)

      const xhr = new XMLHttpRequest()
      xhr.open('POST', 'https://api.cloudinary.com/v1_1/dfrogykwf/image/upload')

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded * 100) / e.total))
        }
      })

      xhr.onload = () => {
        setUploading(false)
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText)
          setImageUrl(res.secure_url)
          resolve(res.secure_url)
        } else {
          reject(new Error('Upload failed'))
        }
      }

      xhr.onerror = () => {
        setUploading(false)
        reject(new Error('Upload error'))
      }

      xhr.send(formData)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      let uploadedUrl = ''
      if (imageFile && !imageUrl) {
        uploadedUrl = await uploadImageToCloudinary()
      } else {
        uploadedUrl = imageUrl
      }
  
      const payload = {
        title,
        content,
        category,
        image: uploadedUrl,
        isAdmin: true,
      }
  
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
  
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Create failed')
  
      setMessage('✅ Post created successfully!')
      setMessageType('success')
  
      // Navigate to the newly created post's detail page
      navigate(`/post/${data.slug}`)
  
      // Reset form
      setTitle('')
      setCategory('uncategorized')
      setContent('')
      setImageFile(null)
      setUploadProgress(0)
      setImageUrl('')
    } catch (err) {
      setMessage(`❌ ${err.message}`)
      setMessageType('error')
    }
  }
  

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            placeholder="Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1"
          />
          <Select className='w-40' value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="uncategorized">Select Category</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput accept="image/*" onChange={handleFileChange} />
          <Button
            type="button"
            color="gray"
            outline
            className="text-black hover:bg-pink-500 rounded-full"
            onClick={uploadImageToCloudinary}
            disabled={!imageFile || uploading}
          >
            {uploading
              ? (
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span>{uploadProgress}%</span>
                </div>
              )
              : 'Upload image'}
          </Button>
        </div>

        {imageUrl && (
          <div className="flex justify-center">
            <img src={imageUrl} alt="Uploaded" className="max-h-80 object-contain" />
          </div>
        )}

        <ReactQuill
          placeholder="Write something..."
          theme="snow"
          className="h-72 mb-12"
          value={content}
          onChange={setContent}
        />

        <Button type="submit" disabled={uploading}>Publish</Button>

        {message && (
          <div className={`text-center mt-4 text-sm font-medium ${
            messageType === 'success' ? 'text-green-600' : 'text-red-600'
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  )
}
