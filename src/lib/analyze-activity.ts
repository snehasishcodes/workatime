export default async function analyzeActivity(projectID: string, imageDataURL: string, activityDetails: string, token: string) {
    const data = await fetch("/api/analyze", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${token}`
        },
        body: JSON.stringify({
            project_id: projectID,
            image_url: imageDataURL,
            activity: activityDetails
        })
    })
        .then((r) => r.json())
        .catch((e) => console.error(e));

    if (!data || !data.success) return;

    console.table({
        success: true,
        activity_ongoing: data.activity_ongoing === true,
        activity_ongoing_probability: data.activity_ongoing_probability ?? 0
    });
}