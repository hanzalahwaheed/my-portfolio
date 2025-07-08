import prisma from "./prisma";
import { format } from "date-fns";

export interface BlogPost {
	id: string;
	title: string;
	slug: string;
	content: string;
	excerpt?: string | null;
	coverImage?: string | null;
	published: boolean;
	publishedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateBlogPostInput {
	title: string;
	content: string;
	excerpt?: string;
	coverImage?: string;
	published?: boolean;
}

export interface UpdateBlogPostInput extends Partial<CreateBlogPostInput> {
	id: string;
}

// Format date to a readable string
const formatDate = (date: Date | null | undefined): string => {
	if (!date) return "";
	return format(date, "MMMM dd, yyyy");
};

export async function getAllPosts(
	publishedOnly: boolean = true
): Promise<BlogPost[]> {
	const posts = await prisma.blogPost.findMany({
		where: publishedOnly ? { published: true } : undefined,
		orderBy: { publishedAt: "desc" },
	});
	return posts;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
	const post = await prisma.blogPost.findUnique({
		where: { slug },
	});
	return post;
}

export async function getPostById(id: string): Promise<BlogPost | null> {
	const post = await prisma.blogPost.findUnique({
		where: { id },
	});
	return post;
}

export async function createPost(data: CreateBlogPostInput): Promise<BlogPost> {
	const now = new Date();
	const slug = generateSlug(data.title);

	const post = await prisma.blogPost.create({
		data: {
			...data,
			slug,
			publishedAt: data.published ? now : null,
		},
	});

	return post;
}

export async function updatePost(data: UpdateBlogPostInput): Promise<BlogPost> {
	const updateData: any = { ...data };

	// If title is being updated, update the slug
	if (data.title) {
		updateData.slug = generateSlug(data.title);
	}

	// If post is being published, set publishedAt
	if (data.published === true) {
		updateData.publishedAt = new Date();
	} else if (data.published === false) {
		updateData.publishedAt = null;
	}

	const { id, ...updateFields } = updateData;

	const post = await prisma.blogPost.update({
		where: { id },
		data: updateFields,
	});

	return post;
}

export async function deletePost(id: string): Promise<boolean> {
	try {
		await prisma.blogPost.delete({
			where: { id },
		});
		return true;
	} catch (error) {
		console.error("Error deleting post:", error);
		return false;
	}
}

// Helper function to generate a URL-friendly slug from a title
export function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^\w\s-]/g, "") // Remove special characters
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
		.trim();
}
