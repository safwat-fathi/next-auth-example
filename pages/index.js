import { signIn, signOut } from "next-auth/react";
import { getSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import { useEffect } from "react";

export default function Home({ session, products }) {
  useEffect(() => {
    console.log(session);
  }, [session]);

  useEffect(() => {
    console.log(products);
  }, [products]);

  return (
    <>
      <h1>NextAuth.js Example</h1>
      <div>
        {!session && <button onClick={signIn}>Sign In</button>}
        {session && <button onClick={signOut}>Sign Out</button>}
      </div>
      <p>
        This is an example site to demonstrate how to use{" "}
        <a href={`https://next-auth.js.org`}>NextAuth.js</a> for authentication.
      </p>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  const token = await getToken({
    req: ctx["req"],
    secret: process.env.NEXTAUTH_JWT_SECRET,
  });

  // fetch products
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const products = await response.json();

  return {
    props: {
      session,
      products,
    },
  };
}
