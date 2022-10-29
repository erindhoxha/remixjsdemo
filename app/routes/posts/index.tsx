import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import { Link } from "react-router-dom";
import { getPostListings } from "~/models/post.server";
import type { LoaderFunction } from "@remix-run/node";
import { useOptionalUser } from "~/utils";
import Header from "~/components/header";

interface Post {
  id: string;
  slug: string;
  title: string;
  markdown: string;
  posts?: Post[];
}

export const loader: LoaderFunction = async () => {
  const posts = await getPostListings();
  return json({ posts });
};

export default function PostsRoute() {
  const { posts } = useLoaderData() as Post;
  const user = useOptionalUser();

  const isAdmin = user?.email == ENV.ADMIN_EMAIL;

  return (
    <main>
      <Header name={user?.email} />
      <section className="mx-auto max-w-4xl p-4">
        {isAdmin ? (
          <Link
            to="admin"
            className="mb-2 rounded bg-red-500 p-2 text-sm text-white"
          >
            Admin page
          </Link>
        ) : null}
        <h1 className="mt-4 mb-2 text-2xl font-medium">Posts</h1>
        <ul className="mt-1 flex w-full flex-col">
          {posts?.map((post: Post) => (
            <li className="flex w-full flex-1" key={post.slug}>
              <Link
                className="mt-2 w-full rounded border p-4 text-base"
                // prefetch="intent"
                to={post.slug}
              >
                <p>{post.title}</p>
                <p className="text-sm text-gray-400">
                  www.test.com/{post.slug}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
