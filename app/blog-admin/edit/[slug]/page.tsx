'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPostById, updatePost, type BlogPost } from '@/lib/blog-service';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';

// Import the MarkdownEditor component with SSR disabled
const MarkdownEditor = dynamic(
  () => import('@/components/MarkdownEditor'),
  { ssr: false }
);

export default function EditBlogPost({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Check if user is authorized and load post data
  useEffect(() => {
    const authorized = sessionStorage.getItem('blogAdminAuthorized') === 'true';
    setIsAuthorized(authorized);
    
    if (!authorized) {
      router.push('/blog-admin');
      return;
    }

    // Load post data
    const loadPost = async () => {
      try {
        const postData = await getPostById(params.slug);
        
        if (!postData) {
          notFound();
          return;
        }
        
        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content);
        setCoverImage(postData.coverImage || '');
        setExcerpt(postData.excerpt || '');
        setIsPublished(postData.published || false);
      } catch (error) {
        console.error('Error loading post:', error);
        setError('Failed to load post');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPost();
  }, [params.slug, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!post?.id) {
      setError('Post not found');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const updatedPost = await updatePost({
        id: post.id,
        title,
        content,
        excerpt: excerpt || undefined,
        coverImage: coverImage || undefined,
        published: isPublished,
      });
      
      if (updatedPost) {
        // Redirect to manage page after successful update
        router.push('/blog-admin/manage');
      } else {
        setError('Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Error updating post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthorized) {
    return null; // Will redirect in useEffect
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        Loading post...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Edit Blog Post</h1>
          <Link 
            href="/blog-admin/manage" 
            className="text-blue-600 hover:underline"
          >
            Cancel
          </Link>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublished"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Published
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              <strong>Post ID:</strong> {post?.id}
            </p>
          </div>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              required
            />
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <strong>Slug:</strong> {post?.slug}
            </p>
          </div>
          
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium mb-1">Excerpt (optional)</label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              rows={2}
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium mb-1">Cover Image URL (optional)</label>
            <input
              type="text"
              id="coverImage"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">Content (Markdown)</label>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              height={500}
              placeholder="Write your post content here (Markdown supported)..."
            />
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <Link
              href="/blog-admin/manage"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
