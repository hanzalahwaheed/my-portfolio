import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/blog-service";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import Image from "next/image";

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

export default async function BlogPost({ params }: { params: { slug: string } }) {
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

				<article className="prose prose-lg dark:prose-invert max-w-none">
					<h1 className="mb-4 text-3xl font-bold md:text-4xl">{post.title}</h1>

					{post.publishedAt && (
						<span className="text-sm text-gray-500 dark:text-gray-400">
							{new Date(post.publishedAt).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</span>
					)}

					{post.coverImage && (
						<div className="mb-8 aspect-video overflow-hidden rounded-lg">
							<Image
								src={post.coverImage}
								alt={post.title}
								width={900}
								height={500}
								className="h-full w-full object-cover"
							/>
						</div>
					)}

					<ReactMarkdown>{post.content}</ReactMarkdown>
				</article>
			</div>
		</div>
	);
}
