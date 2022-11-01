import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import type { LoaderFunction } from "@remix-run/server-runtime/dist/router";
import { Link, Outlet } from "react-router-dom";
import Header from "~/components/header";
import { getPostListings } from "~/models/post.server";
import { requireAdminUser } from "~/session.server";
import { useOptionalUser } from "~/utils";

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPostListings>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminUser(request);
  return json({ posts: await getPostListings() });
};

export default function AdminRoute() {
  const { posts } = useLoaderData() as LoaderData;
  const user = useOptionalUser();
  return (
    <>
      <Header name={user?.email} />
      <main className="mx-auto max-w-4xl p-4">
        <Outlet></Outlet>
      </main>
      <div className="mx-auto max-w-4xl pb-4 pt-2 pl-4 pr-4">
        <h1 className="mb-2 border-b-2 pb-4 text-left text-2xl font-medium">
          Blog Admin
        </h1>
        <div className="grid gap-6">
          <nav className="col-span-4 md:col-span-1">
            <ul className="mt-1 flex w-full flex-col">
              {posts.map((post) => (
                <li className="flex w-full flex-1" key={post?.slug}>
                  <Link
                    className="mt-2 w-full rounded border p-4 text-base"
                    to={`${post.slug}`}
                  >
                    <p>{post.title}</p>
                    <p className="text-sm text-gray-400">
                      www.test.com/{post.slug}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
