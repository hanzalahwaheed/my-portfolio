import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

const blogPosts = [
	{
		title: "What is JavaScript? Why is JavaScript?",
		slug: "what-is-javascript",
		content:
			"In a single sentence, (that you can answer to your interviewer or your professor in a viva), JavaScript is a high-level, interpreted, and loosely typed programming language.\n\nJavaScript is one of the core technologies of the World Wide Web, alongside HTML and CSS. It enables interactive web pages and is an essential part of web applications. The vast majority of websites use it for client-side page behavior, and all major web browsers have a dedicated JavaScript engine to execute it.\n\nKey features of JavaScript include:\n- Dynamic typing\n- Prototype-based object orientation\n- First-class functions\n- Event-driven programming\n- Asynchronous programming with Promises and async/await\n\nJavaScript has evolved significantly since its creation in 1995, with the introduction of ES6 (ECMAScript 2015) bringing major updates like arrow functions, classes, template literals, and more.\n\nToday, JavaScript is not just limited to browsers but can also be used on the server-side through Node.js, making it a full-stack development language.",
		excerpt:
			"A comprehensive introduction to JavaScript, its features, and its role in modern web development.",
		coverImage: "/images/javascript-cover.jpg",
		published: true,
		publishedAt: new Date("2023-06-15"),
		createdAt: new Date("2023-06-15"),
		updatedAt: new Date("2023-06-15"),
	},
];

export async function main() {
	for (const post of blogPosts) {
		await prisma.blogPost.create({ data: post });
	}
}

main();
