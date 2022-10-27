import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import { Link } from "react-router-dom";
import { getPostListings } from "~/models/post.server";
import type { LoaderFunction } from "@remix-run/node";
import { useOptionalUser } from "~/utils";

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
      {isAdmin ? (
        <Link to="admin" className="text-red-600 underline">
          Admin
        </Link>
      ) : null}
      <ul>
        {posts?.map((post: Post) => (
          <li key={post.slug}>
            <Link prefetch="intent" to={post.slug}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
      <h1>Posts</h1>
    </main>
  );
}
