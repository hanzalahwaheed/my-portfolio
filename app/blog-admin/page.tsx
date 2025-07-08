"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BlogAdminAuth() {
	const [passphrase, setPassphrase] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	// This would be replaced with an environment variable in production
	// But for simplicity, we're hardcoding it here
	// In a real app, use process.env.BLOG_SECRET or similar
	const correctPassphrase = "abdul786";

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (passphrase === correctPassphrase) {
			// Store auth status in session storage (not secure but simple)
			sessionStorage.setItem("blogAdminAuthorized", "true");
			router.push("/blog-admin/manage");
		} else {
			setError("Incorrect passphrase");
		}
	};

	return (
		<div className="container mx-auto px-4 py-16">
			<div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow dark:bg-gray-800">
				<h1 className="mb-6 text-center text-2xl font-bold">Blog Admin</h1>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor="passphrase"
							className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
							Enter Passphrase
						</label>
						<input
							type="password"
							id="passphrase"
							value={passphrase}
							onChange={e => setPassphrase(e.target.value)}
							className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
							required
						/>
						{error && <p className="mt-1 text-sm text-red-500">{error}</p>}
					</div>

					<button
						type="submit"
						className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
						Continue
					</button>
				</form>
			</div>
		</div>
	);
}
