import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	metadataBase: new URL("https://hanzalahwaheed.com"),
	alternates: {
		canonical: "https://hanzalahwaheed.com",
	},
	title: "Hanzalah Waheed - Web and AI Developer",
	description:
		"Hanzalah Waheed is a web developer with a passion for creating innovative and user-friendly websites.",
	keywords:
		"Hanzalah Waheed, Web Developer, AI, Web3, Finance, User Experience, UI/UX Design, Design Systems, Front-end Development, Decentralized Finance, DeFi, Swoop Exchange, Vela Exchange, Stealth AI Startup, Technology, Innovation, Human-Centered Design",
	openGraph: {
		locale: "en_US",
		siteName: "Hanzalah Waheed",
		type: "website",
		title: "Hanzalah Waheed",
		description:
			"Hanzalah Waheed is a web developer with a passion for creating innovative and user-friendly websites.",
		url: "https://hanzalahwaheed.com",
		images: [
			{
				url: "./og-large-meik-2.jpg",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Hanzalah Waheed",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="scroll-smooth">
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange>
					{children}
					<Analytics />
				</ThemeProvider>
			</body>
		</html>
	);
}
