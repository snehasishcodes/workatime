import Appbar from "@/components/appbar";
import ProjectSwitcher from "@/components/project-switcher";
import TimeSpent from "@/components/time-spent";
import { Separator } from "@/components/ui/separator";
import { cookies } from "next/headers";
import ActivityConfig from "@/components/activity-config";
import CameraPreview from "@/components/camera-preview";
import TrackingControls from "@/components/tracking-controls";
import { redirect } from "next/navigation";

export default async function App() {
	const cookieStore = await cookies();
	const token = cookieStore.get("workatime_user")?.value;
	if (!token) redirect("/auth");

	const [userData, projectsData] = await Promise.all([
		fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user`, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `${token}`
			}
		}).then((r) => r.json()).catch((error) => {
			console.error("Could not fetch user", error);
			return { user: null };
		}),
		fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/projects`, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `${token}`
			}
		}).then((r) => r.json()).catch((error) => {
			console.error("Could not fetch projects", error);
			return { projects: null };
		}),
	]);

	if (!userData?.user || !projectsData?.projects) redirect("/auth");

	const { user } = userData;
	const { projects } = projectsData;


	return (
		<main className="min-h-screen w-full">
			<Appbar
				user={user}
			/>

			<div className="h-full w-full flex flex-col md:flex-row justify-evenly items-center gap-5">
				<div id="details" className="h-full w-full flex flex-col justify-center gap-4 p-4 border-r border-dashed">
					<div className="w-full flex flex-row justify-between items-center gap-4">
						<ProjectSwitcher
							projects={projects}
							token={token}
						/>
					</div>

					<TimeSpent />

					<Separator className="my-5" />

					<ActivityConfig />
				</div>

				<div id="config" className="h-full w-full flex flex-col justify-center gap-4 p-4">
					<CameraPreview />

					<TrackingControls />
				</div>
			</div>
		</main>
	)
}