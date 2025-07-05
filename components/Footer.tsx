"use client";

export default function Footer() {
	return (
		<section>
			<div className="mt-16 flex flex-col gap-4 lg:px-6">
				<p className="text-start text-sm text-muted-foreground">
					Based on{" "}
					<a className="text-foreground" href="https://brittanychiang.com">
						Brittany Chiang&apos;s website
					</a>{" "}
					and{" "}
					<a className="text-foreground" href="https://meikopoulos.com">
						Alexander Meikopoulos&apos;s website
					</a>
					. Coded in{" "}
					<a className="text-foreground" href="https://code.visualstudio.com/">
						Windsurf.
					</a>{" "}
					Built with{" "}
					<a className="text-foreground" href="https://nextjs.org/">
						Next.js
					</a>
					,{" "}
					<a className="text-foreground" href="https://tailwindcss.com/">
						Tailwind CSS
					</a>{" "}
					and{" "}
					<a className="text-foreground" href="https://ui.shadcn.com/">
						Shadcn/ui
					</a>
					, deployed with{" "}
					<a className="text-foreground" href="https://vercel.com/">
						Vercel
					</a>
					.
				</p>
			</div>
		</section>
	);
}
