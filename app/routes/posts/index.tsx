import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import { Link } from "react-router-dom";
import { getPosts } from "~/models/post.server";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  const posts = await getPosts();

  return json({ posts });

  // This ^ replaces this ->

  /* 
    const postsString = JSON.stringify( { posts } );

    return new Response(postsString, {
        headers: {
            'Content-Type': "application/json",
        }
    })
    */
};

interface Post {
  _uid: string;
  slug: string;
  title: string;
}

export default function PostsRoute() {
  const { posts } = useLoaderData();

  console.log(useLoaderData());

  return (
    <main>
      <ul>
        {posts.map((post: Post) => (
          <li key={post._uid}>
            <Link to={post.slug}>{post.title}</Link>
          </li>
        ))}
      </ul>
      <h1>Posts</h1>
    </main>
  );
}
