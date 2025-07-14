// src/pages/UpdatePost.jsx
import {
  Button,
  FileInput,
  Select,
  TextInput
} from 'flowbite-react';
import { useSelector } from 'react-redux';

import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';

export default function UpdatePost() {
  const { postId } = useParams();
  const navigate = useNavigate();
const { currentUser } = useSelector((state) => state.user);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('uncategorized');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (res.ok && data.posts.length > 0) {
          const post = data.posts[0];
          setTitle(post.title);
          setCategory(post.category || 'uncategorized');
          setContent(post.content);
          setImageUrl(post.image || '');
        } else {
          setMessage('Post not found');
          setMessageType('error');
        }
      } catch (err) {
        setMessage('Failed to load post');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    setUploadProgress(0);
    setImageUrl('');
    setMessage('');
  };

  const uploadImageToCloudinary = () => {
    return new Promise((resolve, reject) => {
      if (!imageFile) return resolve('');
      setUploading(true);
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', 'mern-blog');
      formData.append('folder', `posts/${category}`);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://api.cloudinary.com/v1_1/dfrogykwf/image/upload');

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded * 100) / e.total));
        }
      });

      xhr.onload = () => {
        setUploading(false);
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          setImageUrl(res.secure_url);
          resolve(res.secure_url);
        } else {
          reject(new Error('Upload failed'));
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        reject(new Error('Upload error'));
      };

      xhr.send(formData);
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    let uploadedUrl = imageUrl;
    if (imageFile && !imageUrl) {
      uploadedUrl = await uploadImageToCloudinary();
    }

    const payload = {
      title,
      content,
      category,
      image: uploadedUrl,
    };

    const res = await fetch(`/api/post/updatepost/${postId}/${currentUser._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Update failed');

    setMessage('✅ Post updated successfully!');
    setMessageType('success');
    navigate('/dashboard');
  } catch (err) {
    setMessage(`❌ ${err.message}`);
    setMessageType('error');
  }
};


  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Edit Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            placeholder="Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1"
          />
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-yellow-500 border-dotted p-3">
          <FileInput accept="image/*" onChange={handleFileChange} />
          <Button
            type="button"
            color="gray"
            outline
            className="text-black hover:bg-yellow-500 rounded-full"
            onClick={uploadImageToCloudinary}
            disabled={!imageFile || uploading}
          >
            {uploading ? (
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span>{uploadProgress}%</span>
              </div>
            ) : (
              'Upload image'
            )}
          </Button>
        </div>

        {imageUrl && (
          <div className="flex justify-center">
            <img src={imageUrl} alt="Uploaded" className="max-h-80 object-contain" />
          </div>
        )}

        <ReactQuill
          placeholder="Edit your content..."
          theme="snow"
          className="h-72 mb-12"
          value={content}
          onChange={setContent}
        />

        <Button type="submit" disabled={uploading}>Update</Button>

        {message && (
          <div className={`text-center mt-4 text-sm font-medium ${
            messageType === 'success' ? 'text-green-600' : 'text-red-600'
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
