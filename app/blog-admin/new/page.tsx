"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPost } from "@/lib/blog-service";
import dynamic from 'next/dynamic';

// Import the MarkdownEditor component with SSR disabled
const MarkdownEditor = dynamic(
  () => import('@/components/MarkdownEditor'),
  { ssr: false }
);

export default function NewBlogPost() {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [coverImage, setCoverImage] = useState("");
	const [excerpt, setExcerpt] = useState("");
	const [isPublished, setIsPublished] = useState(false);
	const [isAuthorized, setIsAuthorized] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	// Check if user is authorized
	useEffect(() => {
		const authorized = sessionStorage.getItem("blogAdminAuthorized") === "true";
		setIsAuthorized(authorized);

		if (!authorized) {
			router.push("/blog-admin");
		}
	}, [router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title || !content) {
			setError("Title and content are required");
			return;
		}

		setIsSubmitting(true);
		setError("");

		try {
			const newPost = await createPost({
				title,
				content,
				excerpt: excerpt || undefined,
				coverImage: coverImage || undefined,
				published: isPublished,
			});

			if (newPost) {
				// Redirect to manage page after successful save
				router.push("/blog-admin/manage");
			} else {
				setError("Failed to create post");
			}
		} catch (error) {
			console.error("Error creating post:", error);
			setError("Error creating post. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!isAuthorized) {
		return null; // Will redirect in useEffect
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mx-auto max-w-4xl">
				<div className="mb-8 flex items-center justify-between">
					<h1 className="text-3xl font-bold">Create New Blog Post</h1>
					<Link
						href="/blog-admin/manage"
						className="text-blue-600 hover:underline">
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
								onChange={e => setIsPublished(e.target.checked)}
								className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<label
								htmlFor="isPublished"
								className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
								Publish this post
							</label>
						</div>
						{error && (
							<div className="mb-4 rounded-md bg-red-100 p-3 text-red-700 dark:bg-red-900 dark:text-red-200">
								{error}
							</div>
						)}
					</div>
					<div>
						<label htmlFor="title" className="mb-1 block text-sm font-medium">
							Title
						</label>
						<input
							type="text"
							id="title"
							value={title}
							onChange={e => setTitle(e.target.value)}
							className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
							placeholder="Enter post title"
							required
						/>
					</div>

					<div>
						<div>
							<label htmlFor="content" className="mb-1 block text-sm font-medium">
								Content
							</label>
							<MarkdownEditor
								value={content}
								onChange={setContent}
								height={500}
								placeholder="Write your post content here (Markdown supported)..."
							/>
						</div>
					</div>

					<div>
						<label htmlFor="excerpt" className="mb-1 block text-sm font-medium">
							Excerpt (optional)
						</label>
						<textarea
							id="excerpt"
							value={excerpt}
							onChange={e => setExcerpt(e.target.value)}
							className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
							rows={3}
							placeholder="A short excerpt for the blog listing"
						/>
					</div>

					<div>
						<label
							htmlFor="coverImage"
							className="mb-1 block text-sm font-medium">
							Cover Image URL (optional)
						</label>
						<input
							type="url"
							id="coverImage"
							value={coverImage}
							onChange={e => setCoverImage(e.target.value)}
							className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
							placeholder="https://example.com/image.jpg"
						/>
					</div>

					<div className="flex justify-end space-x-4 pt-4">
						<Link
							href="/blog-admin/manage"
							className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
							Cancel
						</Link>
						<button
							type="submit"
							disabled={isSubmitting}
							className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50">
							{isSubmitting ? "Saving..." : "Save Post"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
