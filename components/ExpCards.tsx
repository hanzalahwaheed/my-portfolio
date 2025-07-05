"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoveRight } from "lucide-react";

const jobPositions = [
	{
		timeline: "Aug 2024 — Present",
		currentPosition: "Founding Frontend Engineer",
		place: "stockinsights.ai",
		previousPositions: [""],
		description:
			"I am the founding frontend engineer at stockinsights.ai, a startup that uses AI to provide insights into the stock market. I am responsible for building the frontend of the application, which includes creating user interfaces, implementing user experience, and ensuring that the application is accessible and user-friendly.",
		skills: [
			"Next.js",
			"React",
			"TypeScript",
			"Tailwind CSS",
			"Figma",
			"UI/UX Design",
		],
	},
];

export default function ExpCard() {
	return (
		<section id="experience" className="scroll-mt-16 lg:mt-16">
			<div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
				<h2 className="text-sm font-bold uppercase tracking-widest lg:sr-only">
					Experience
				</h2>
			</div>
			<>
				{jobPositions.map((job, index) => (
					<Card
						key={index}
						className="mb-4 flex min-h-fit w-full flex-col gap-0 border-transparent hover:border lg:flex-row lg:gap-5 lg:p-6 lg:hover:border-t-blue-200 lg:hover:bg-slate-100/50 lg:hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:hover:drop-shadow-lg dark:lg:hover:border-t-blue-900 dark:lg:hover:bg-slate-800/50">
						<CardHeader className="h-full w-full p-0">
							<CardTitle className="whitespace-nowrap text-base text-slate-400">
								{job.timeline}
							</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col p-0">
							<p className="font-bold text-foreground">
								{job.currentPosition} • {job.place}
							</p>
							{job.previousPositions.map((position, index) => (
								<p key={index} className="text-sm font-bold text-slate-400">
									{position}
								</p>
							))}
							<CardDescription className="py-3 text-muted-foreground">
								{job.description}
							</CardDescription>
							<CardFooter className="flex flex-wrap gap-2 p-0">
								{job.skills.map((skill, index) => (
									<Badge key={index}>{skill}</Badge>
								))}
							</CardFooter>
						</CardContent>
					</Card>
				))}
			</>
			<div className="mt-12 lg:px-12">
				<a
					href="mailto:hanzalah.w@gmail.com"
					target="_blank"
					rel="noopener noreferrer"
					className="group inline-flex items-center font-medium leading-tight text-foreground">
					<span className="border-b border-transparent pb-px transition hover:border-primary motion-reduce:transition-none">
						Reach out for Full Resume
					</span>
					<MoveRight className="ml-1 inline-block h-5 w-5 shrink-0 -translate-y-px transition-transform group-hover:translate-x-2 group-focus-visible:translate-x-2 motion-reduce:transition-none" />
				</a>
			</div>
		</section>
	);
}
