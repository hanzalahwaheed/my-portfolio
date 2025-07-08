import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compareDesc, format, parseISO } from "date-fns";

// Types
export interface BlogPost {
	slug: string;
	title: string;
	date: string;
	content: string;
	excerpt?: string;
	coverImage?: string;
}

// Path to our blog posts directory
const postsDirectory = path.join(process.cwd(), "content", "blog");

// Ensure posts directory exists
export function ensurePostsDirectory() {
	if (!fs.existsSync(postsDirectory)) {
		fs.mkdirSync(postsDirectory, { recursive: true });
	}
}

// Get all blog posts
export function getAllPosts(): BlogPost[] {
	ensurePostsDirectory();

	// Check if directory exists and has files
	if (!fs.existsSync(postsDirectory)) {
		return [];
	}

	const fileNames = fs.readdirSync(postsDirectory);

	const allPostsData = fileNames
		.filter(fileName => fileName.endsWith(".md"))
		.map(fileName => {
			// Remove ".md" from file name to get id/slug
			const slug = fileName.replace(/\.md$/, "");

			// Read markdown file as string
			const fullPath = path.join(postsDirectory, fileName);
			const fileContents = fs.readFileSync(fullPath, "utf8");

			// Use gray-matter to parse the post metadata section
			const { data, content } = matter(fileContents);

			// Format the date
			const date = data.date
				? format(parseISO(data.date), "MMMM dd, yyyy")
				: "";

			// Generate excerpt if not provided
			const excerpt = data.excerpt || content.slice(0, 150) + "...";

			// Combine the data
			return {
				slug,
				title: data.title || "Untitled",
				date,
				content,
				excerpt,
				coverImage: data.coverImage || "",
			};
		})
		.sort((a, b) => {
			// Sort by date in descending order
			if (a.date && b.date) {
				return compareDesc(new Date(a.date), new Date(b.date));
			}
			return 0;
		});

	return allPostsData;
}

// Get a specific post by slug
export function getPostBySlug(slug: string): BlogPost | null {
	try {
		const fullPath = path.join(postsDirectory, `${slug}.md`);

		if (!fs.existsSync(fullPath)) {
			return null;
		}

		const fileContents = fs.readFileSync(fullPath, "utf8");
		const { data, content } = matter(fileContents);

		// Format the date
		const date = data.date ? format(parseISO(data.date), "MMMM dd, yyyy") : "";

		return {
			slug,
			title: data.title || "Untitled",
			date,
			content,
			excerpt: data.excerpt || content.slice(0, 150) + "...",
			coverImage: data.coverImage || "",
		};
	} catch (error) {
		console.error(`Error getting post ${slug}:`, error);
		return null;
	}
}

// Save a blog post
export function savePost(post: BlogPost): boolean {
	try {
		ensurePostsDirectory();

		const fullPath = path.join(postsDirectory, `${post.slug}.md`);

		// Prepare front matter
		const frontMatter = {
			title: post.title,
			date: post.date ? post.date : format(new Date(), "yyyy-MM-dd"),
			excerpt: post.excerpt,
			coverImage: post.coverImage,
		};

		// Create markdown content with front matter
		const fileContent = matter.stringify(post.content, frontMatter);

		// Write to file
		fs.writeFileSync(fullPath, fileContent);
		return true;
	} catch (error) {
		console.error(`Error saving post ${post.slug}:`, error);
		return false;
	}
}

// Delete a blog post
export function deletePost(slug: string): boolean {
	try {
		const fullPath = path.join(postsDirectory, `${slug}.md`);

		if (fs.existsSync(fullPath)) {
			fs.unlinkSync(fullPath);
			return true;
		}

		return false;
	} catch (error) {
		console.error(`Error deleting post ${slug}:`, error);
		return false;
	}
}

// Simple function to generate a slug from a title
export function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^\w\s-]/g, "") // Remove special characters
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
		.trim();
}
