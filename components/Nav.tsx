"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Linkedin } from "lucide-react";
import { ModeToggle } from "./ui/toggle-mode";
import useActiveSection from "@/hooks/useActiveSection";

type NavItem = {
	name: string;
	href: string;
};

export default function Nav() {
	const activeSection = useActiveSection([
		"about",
		"experience",
		"projects",
		"contact",
	]);

	const navItems: NavItem[] = [
		{ name: "About", href: "#about" },
		{ name: "Experience", href: "#experience" },
		{ name: "Projects", href: "#projects" },
		{ name: "Contact", href: "#contact" },
	];

	const getNavItemClasses = (href: string) => {
		const isActive = activeSection === href.substring(1);
		return {
			linkClass: isActive ? "active" : "",
			indicatorClass: `nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all ${
				isActive
					? "active w-16 bg-foreground h-2"
					: "group-hover:w-16 group-hover:bg-foreground group-hover:h-px"
			}`,
			textClass: `nav-text text-xs font-bold uppercase tracking-widest ${
				isActive
					? "text-foreground"
					: "text-slate-500 group-hover:text-foreground"
			}`,
		};
	};

	return (
		<header className="flex flex-col lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:gap-4 lg:py-24">
			<div className="mt-6 flex flex-col gap-4 lg:mt-0 lg:pr-24">
				<div className="flex w-full lg:items-center lg:justify-start">
					<Avatar className="h-auto w-24 border-2 border-primary bg-secondary lg:w-36">
						<AvatarImage src="./avatar.png" />
						<AvatarFallback className="border-1 h-24 w-24 rounded-full border-primary lg:h-36 lg:w-36">
							AM
						</AvatarFallback>
					</Avatar>
				</div>
				<h1 className="text-[42px] font-bold lg:text-start">
					Hey! I&#39;m Hanzalah👋
				</h1>
				<h2 className="text-xl lg:text-start">
					High Agency; Full Stack; Developer;
				</h2>
				<p className="text-lg text-muted-foreground lg:text-start">
					I help innovative startups in AI, Web3, and Finance craft exceptional
					user experiences, translating complex technologies into intuitive
					interfaces that resonate with humans.
				</p>
			</div>
			<nav className="hidden lg:flex">
				<ul className="flex w-max flex-col gap-6 text-start text-xs font-medium uppercase">
					{navItems.map((item: NavItem) => {
						const { linkClass, indicatorClass, textClass } = getNavItemClasses(
							item.href
						);
						return (
							<li key={item.name} className="group">
								<a href={item.href} className={`py-3 ${linkClass}`}>
									<span className={indicatorClass}></span>
									<span className={textClass}>{item.name}</span>
								</a>
							</li>
						);
					})}
				</ul>
			</nav>
			<ul className="mt-6 flex flex-row gap-6 lg:mt-0">
				<Button variant="outline" size="icon">
					<a
						href="https://github.com/hanzalahwaheed"
						target="_blank"
						rel="noopener noreferrer">
						<Github className="h-[1.2rem] w-[1.2rem]" />
					</a>
				</Button>
				<Button variant="outline" size="icon">
					<a
						href="https://linkedin.com/in/hanzalahwaheed"
						target="_blank"
						rel="noopener noreferrer">
						<Linkedin className="h-[1.2rem] w-[1.2rem]" />
					</a>
				</Button>
				<ModeToggle />
			</ul>
		</header>
	);
}
