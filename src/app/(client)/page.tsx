import Appbar from "@/components/appbar";
import ProjectSwitcher from "@/components/project-switcher";
import TimeSpent from "@/components/time-spent";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { cookies } from "next/headers";
import ActivityConfig from "@/components/activity-config";
import CameraPreview from "@/components/camera-preview";

export default async function App() {
	const cookieStore = await cookies();
	const userData: { user: User | null } =
		await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user`, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `${cookieStore.get("workatime_user")?.value}`
			}
		})
			.then((r) => r.json())
			.catch((error) => console.error("Could not fetch user", error));
	const { user } = userData;

	return (
		<main className="min-h-screen w-full">
			<Appbar
				user={user}
			/>

			<div className="h-full w-full flex flex-col md:flex-row justify-evenly items-center gap-5">
				<div id="details" className="h-full w-full flex flex-col justify-center gap-4 p-4 border-r border-dashed">
					<div className="w-full flex flex-row justify-between items-center gap-4">
						<ProjectSwitcher />
					</div>

					<TimeSpent />

					<Separator className="my-5" />

					<ActivityConfig />
				</div>

				<div id="config" className="h-full w-full flex flex-col justify-center gap-4 p-4">
					<CameraPreview />

					<div className="flex flex-col justify-center items-center gap-4 my-5">
						<Button size="lg">
							Start Tracking Activity
						</Button>
					</div>
				</div>
			</div>
		</main>
	)
}