import NextAuth from 'next-auth';

// Placeholder for SSO/SAML configuration using NextAuth.
// In a real enterprise setup, we would use a SAML provider or OIDC (Okta, Entra ID, etc.)
// e.g. import OktaProvider from 'next-auth/providers/okta';

const handler = NextAuth({
  providers: [
    // OktaProvider({
    //   clientId: process.env.OKTA_CLIENT_ID as string,
    //   clientSecret: process.env.OKTA_CLIENT_SECRET as string,
    //   issuer: process.env.OKTA_ISSUER as string,
    // }),
    {
      id: 'saml-mock',
      name: 'Mock SAML',
      type: 'oauth',
      version: '2.0',
      // This is just a boilerplate for MVP purposes.
      // We'll plug in an actual enterprise IdP here when requested by a customer.
      authorization: { url: 'https://example.com/oauth/authorize' },
      token: { url: 'https://example.com/oauth/token' },
      userinfo: { url: 'https://example.com/oauth/userinfo' },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
        }
      }
    }
  ],
  callbacks: {
    async session({ session, token }) {
      // Add tenant or organization info to session here
      return session;
    }
  }
});

export { handler as GET, handler as POST };
