"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllPosts, deletePost, BlogPost } from "@/lib/blog-service";

export default function ManageBlogPosts() {
	const [posts, setPosts] = useState<BlogPost[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthorized, setIsAuthorized] = useState(false);
	const router = useRouter();

	// Check if user is authorized
	useEffect(() => {
		const authorized = sessionStorage.getItem("blogAdminAuthorized") === "true";
		setIsAuthorized(authorized);

		if (!authorized) {
			router.push("/blog-admin");
		} else {
			// Load posts
			const loadPosts = async () => {
				try {
					const allPosts = await getAllPosts(false); // false to get all posts, including drafts
					setPosts(allPosts);
				} catch (error) {
					console.error("Error loading posts:", error);
				} finally {
					setIsLoading(false);
				}
			};

			loadPosts();
		}
	}, [router]);

	// Handle delete post
	const handleDeletePost = async (postId: string) => {
		if (window.confirm("Are you sure you want to delete this post?")) {
			try {
				const success = await deletePost(postId);
				if (success) {
					setPosts(posts.filter(post => post.id !== postId));
				} else {
					alert("Failed to delete post");
				}
			} catch (error) {
				console.error("Error deleting post:", error);
				alert("Error deleting post");
			}
		}
	};

	if (!isAuthorized) {
		return null; // Will redirect in useEffect
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mx-auto max-w-5xl">
				<div className="mb-8 flex items-center justify-between">
					<h1 className="text-3xl font-bold">Manage Blog Posts</h1>
					<Link
						href="/blog-admin/new"
						className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
						Create New Post
					</Link>
				</div>

				{isLoading ? (
					<div className="py-10 text-center">
						<p>Loading posts...</p>
					</div>
				) : posts.length === 0 ? (
					<div className="rounded-lg border py-10 text-center">
						<p className="mb-4 text-lg text-gray-600 dark:text-gray-400">
							No blog posts yet
						</p>
						<Link
							href="/blog-admin/new"
							className="text-blue-600 hover:underline dark:text-blue-400">
							Create your first post
						</Link>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full border-collapse">
							<thead>
								<tr className="bg-gray-100 dark:bg-gray-800">
									<th className="px-4 py-3 text-left">Title</th>
									<th className="px-4 py-3 text-left">Date</th>
									<th className="px-4 py-3 text-left">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
								{posts.map(post => (
									<tr
										key={post.slug}
										className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
										<td className="px-4 py-3">
											<Link
												href={`/blog/${post.slug}`}
												className="font-medium hover:text-blue-600"
												target="_blank">
												{post.title}
											</Link>
										</td>
										<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
											{post.publishedAt
												? new Date(post.publishedAt).toLocaleDateString()
												: "Draft"}
										</td>
										<td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
											<Link
												href={`/blog-admin/edit/${post.id}`}
												className="mr-4 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
												Edit
											</Link>
											<button
												onClick={() => handleDeletePost(post.id)}
												className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
												Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				<div className="mt-8">
					<Link
						href="/blog"
						className="text-blue-600 hover:underline dark:text-blue-400">
						View Blog
					</Link>
				</div>
			</div>
		</div>
	);
}
