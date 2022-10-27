import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import type { LoaderFunction } from "@remix-run/server-runtime/dist/router";
import { Link, Outlet } from "react-router-dom";
import { getPostListings } from "~/models/post.server";
import { requireAdminUser } from "~/session.server";

// type Post = {
//   slug: string;
//   title: string;
// };

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPostListings>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminUser(request);
  return json({ posts: await getPostListings() });
};

export default function AdminRoute() {
  const { posts } = useLoaderData() as LoaderData;
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="my-6 mb-2 border-b-2 text-center text-3xl">Blog Admin</h1>
      <div className="grid grid-cols-2 gap-6">
        <nav className="col-span-4 md:col-span-1">
          <ul>
            {posts.map((item) => (
              <li className="block" key={item?.slug}>
                <Link to={`${item.slug}`}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <main>
          <Outlet></Outlet>
        </main>
      </div>
    </div>
  );
}
