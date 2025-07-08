import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/blog-service";

export const metadata = {
	title: "Blog | Portfolio",
	description: "Read my latest thoughts and insights",
};

export default async function BlogPage() {
	const posts = await getAllPosts(true); // true to get only published posts

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mx-auto max-w-4xl">
				<h1 className="mb-6 text-3xl font-bold md:text-4xl">Blog</h1>

				{posts.length === 0 ? (
					<div className="py-10 text-center">
						<p className="text-lg text-gray-600 dark:text-gray-400">
							No blog posts yet. Check back soon!
						</p>
					</div>
				) : (
					<div className="space-y-8">
						{posts.map(post => (
							<article
								key={post.slug}
								className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-md dark:border-gray-800">
								<Link href={`/blog/${post.slug}`} className="block">
									{post.coverImage && (
										<div className="mb-4 aspect-video overflow-hidden rounded-md">
											<Image
												src={post.coverImage}
												alt={post.title}
												width={900}
												height={500}
												className="h-full w-full object-cover"
											/>
										</div>
									)}
									<h2 className="mb-2 text-2xl font-semibold transition-colors hover:text-blue-600 dark:hover:text-blue-400">
										{post.title}
									</h2>
									{post.publishedAt && (
										<p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
											{new Date(post.publishedAt).toLocaleDateString("en-US", {
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
										</p>
									)}
									<p className="line-clamp-3 text-gray-600 dark:text-gray-300">
										{post.excerpt}
									</p>
									<p className="mt-4 font-medium text-blue-600 dark:text-blue-400">
										Read more →
									</p>
								</Link>
							</article>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
