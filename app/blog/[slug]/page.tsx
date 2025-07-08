import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/blog-service";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";

// Dynamically import the Markdown renderer to avoid SSR issues
const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

// Import the styles for the markdown content
import "github-markdown-css/github-markdown.css";

// Generate metadata for the page
export async function generateMetadata({
	params,
}: {
	params: { slug: string };
}) {
	const post = await getPostBySlug(params.slug);

	if (!post) {
		return {
			title: "Post Not Found",
			description: "The requested blog post could not be found.",
		};
	}

	return {
		title: `${post.title} | Portfolio Blog`,
		description: post.excerpt || "",
	};
}

// Generate static params for all blog posts at build time
export async function generateStaticParams() {
	const posts = await getAllPosts(true); // true to get only published posts

	return posts.map(post => ({
		slug: post.slug,
	}));
}

export default async function BlogPost({
	params,
}: {
	params: { slug: string };
}) {
	const post = await getPostBySlug(params.slug);

	// If post doesn't exist, return 404
	if (!post) {
		notFound();
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mx-auto max-w-3xl">
				<Link
					href="/blog"
					className="mb-6 inline-flex items-center text-blue-600 hover:underline dark:text-blue-400">
					← Back to all posts
				</Link>

				<article className="mx-auto max-w-3xl">
					<header className="mb-8">
						<h1 className="mb-4 text-3xl font-bold md:text-5xl">
							{post.title}
						</h1>

						{post.publishedAt && (
							<time
								dateTime={new Date(post.publishedAt).toISOString()}
								className="text-sm text-gray-500 dark:text-gray-400">
								{new Date(post.publishedAt).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</time>
						)}

						{post.coverImage && (
							<div className="my-8 aspect-video overflow-hidden rounded-lg shadow-lg">
								<Image
									src={post.coverImage}
									alt={post.title}
									width={1200}
									height={630}
									className="h-full w-full object-cover"
								/>
							</div>
						)}
					</header>

					<div className="markdown-body rounded-lg p-6 dark:bg-gray-900 dark:text-gray-100">
						<ReactMarkdown
							components={{
								h1: ({ node, ...props }) => (
									<h1 className="mb-4 mt-8 text-3xl font-bold" {...props} />
								),
								h2: ({ node, ...props }) => (
									<h2 className="mb-3 mt-6 text-2xl font-bold" {...props} />
								),
								h3: ({ node, ...props }) => (
									<h3 className="mb-2 mt-5 text-xl font-bold" {...props} />
								),
								p: ({ node, ...props }) => (
									<p className="mb-4 leading-relaxed" {...props} />
								),
								a: ({ node, ...props }) => (
									<a
										className="text-blue-600 hover:underline dark:text-blue-400"
										target="_blank"
										rel="noopener noreferrer"
										{...props}
									/>
								),
								ul: ({ node, ...props }) => (
									<ul className="mb-4 list-disc space-y-2 pl-6" {...props} />
								),
								ol: ({ node, ...props }) => (
									<ol className="mb-4 list-decimal space-y-2 pl-6" {...props} />
								),
								code: ({
									node,
									className,
									children,
									...props
								}: {
									node?: any;
									className?: string;
									children?: React.ReactNode;
								}) => {
									const isInline = className
										? !className.includes("language-")
										: true;
									if (isInline) {
										return (
											<code
												className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm dark:bg-gray-800"
												{...props}>
												{children}
											</code>
										);
									}
									return (
										<pre className="my-4 overflow-x-auto rounded-md bg-gray-100 p-4 dark:bg-gray-800">
											<code className="font-mono text-sm" {...props}>
												{children}
											</code>
										</pre>
									);
								},
								blockquote: ({ node, ...props }) => (
									<blockquote
										className="my-4 border-l-4 border-gray-300 pl-4 italic text-gray-600 dark:border-gray-600 dark:text-gray-300"
										{...props}
									/>
								),
								img: ({
									node,
									src,
									alt = "",
								}: {
									node?: any;
									src?: string;
									alt?: string;
								}) => {
									// Define default dimensions as numbers
									const width = 800;
									const height = 450;

									// Handle external images and local images differently
									if (src?.startsWith("http") || src?.startsWith("//")) {
										return (
											<div className="my-4">
												<Image
													src={src}
													alt={alt || "Blog post image"}
													width={width}
													height={height}
													className="h-auto max-w-full rounded-lg shadow-md"
												/>
											</div>
										);
									}
									// Fallback for local images or other cases
									return (
										<div className="my-4">
											<Image
												src={src || "/placeholder.svg"}
												alt={alt || "Blog post image"}
												width={width}
												height={height}
												className="h-auto max-w-full rounded-lg shadow-md"
											/>
										</div>
									);
								},
								table: ({ node, ...props }) => (
									<div className="my-4 overflow-x-auto">
										<table className="min-w-full border-collapse" {...props} />
									</div>
								),
								thead: ({ node, ...props }) => (
									<thead className="bg-gray-50 dark:bg-gray-700" {...props} />
								),
								tbody: ({ node, ...props }) => (
									<tbody
										className="divide-y divide-gray-200 dark:divide-gray-700"
										{...props}
									/>
								),
								tr: ({ node, ...props }) => (
									<tr
										className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
										{...props}
									/>
								),
								th: ({ node, ...props }) => (
									<th
										className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
										{...props}
									/>
								),
								td: ({ node, ...props }) => (
									<td
										className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100"
										{...props}
									/>
								),
							}}>
							{post.content}
						</ReactMarkdown>
					</div>
				</article>
			</div>
		</div>
	);
}
