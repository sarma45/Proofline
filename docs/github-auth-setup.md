# GitHub sign-in setup

Proofline uses NextAuth's GitHub OAuth provider for **sign-in**. GitHub App installation is a separate step used to grant repository access. The GitHub webhook URL is not an OAuth callback.

## GitHub App settings

In the GitHub App that Proofline should use, configure:

- **Homepage URL:** `https://proofline-tau-plum.vercel.app`
- **User authorization callback URL / Redirect URI:** `https://proofline-tau-plum.vercel.app/api/auth/callback/github`
- **User permissions:** allow access to the user's email address. Proofline requests `read:user` and `user:email` and requires a verified primary email.

Save the GitHub App settings. Copy its **Client ID** and create/copy the **Client Secret** for that same app. Do not use the App ID as the Client ID, and do not mix a Client ID from one app with a secret from another.

If the production hostname changes, update the callback URL to exactly:

```text
https://YOUR-PRODUCTION-HOST/api/auth/callback/github
```

Use the same host to open Proofline and in the GitHub app callback setting. Avoid deployment-specific Vercel URLs, which can be protected by Vercel SSO.

## Vercel environment variables

Set these for the **Production** environment, then redeploy:

| Name | Value |
| --- | --- |
| `GITHUB_CLIENT_ID` | Client ID from the GitHub App above |
| `GITHUB_CLIENT_SECRET` | Client secret from that same GitHub App |
| `NEXTAUTH_SECRET` | A long, random secret unique to this deployment |
| `NEXTAUTH_URL` | `https://proofline-tau-plum.vercel.app` |
| `NEXT_PUBLIC_GITHUB_APP_SLUG` | GitHub App slug, currently `proofline-mahadeva` |

`NEXTAUTH_URL` anchors NextAuth to the production hostname, preventing the callback from changing based on a deployment alias. Never commit secret values or send them in chat.

## End-to-end smoke test

1. Open `https://proofline-tau-plum.vercel.app/auth/signin`.
2. Confirm the GitHub authorization request's `client_id` is the Client ID of the intended GitHub App and `redirect_uri` is exactly `https://proofline-tau-plum.vercel.app/api/auth/callback/github`.
3. Authorize with a GitHub account that has a verified primary email.
4. Confirm Proofline returns to `/onboarding`, shows that you are signed in, and that `/dashboard` opens.
5. Use **Install Proofline on GitHub** to install the GitHub App on the intended repositories.

If GitHub returns a 404 before showing an authorization/consent page, check that the Client ID in the authorization URL belongs to an active GitHub App. That response happens before Proofline's callback code runs, so changing callback handling in the repository will not fix an invalid/disabled GitHub App credential.

## Separate webhook configuration

For GitHub App events, the webhook URL is `https://proofline-tau-plum.vercel.app/api/v1/github/webhooks`. The current repository endpoint is an MVP stub; it does not yet verify the signature or process/enqueue events. Do not treat an HTTP 202 from that endpoint as proof that repository events are connected.
