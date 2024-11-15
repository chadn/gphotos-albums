import { DefaultUser } from 'next-auth';
// https://stackoverflow.com/questions/74425533/property-role-does-not-exist-on-type-user-adapteruser-in-nextauth
// https://github.com/nextauthjs/next-auth/issues/6455

declare module 'next-auth' {
  /*
  interface Session {
    id: string;
    role: number;
  }
  */
  interface User extends DefaultUser {
    id: string;
    email: string;
    image: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email_verified: boolean;
  }
}
