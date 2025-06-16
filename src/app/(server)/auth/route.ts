export async function GET() {
    const params = new URLSearchParams({
        client_id: process.env.SLACK_CLIENT_ID!,
        scope: "identity.basic,identity.email,identity.avatar",
        redirect_uri: process.env.SLACK_REDIRECT_URI!,
    });

    return Response.redirect(`https://slack.com/oauth/v2/authorize?${params.toString()}`);
}