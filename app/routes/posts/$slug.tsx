import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import type { LoaderFunction } from "@remix-run/node";
import { getPost } from "~/models/post.server";
import { marked } from "marked";
import invariant from "tiny-invariant";

interface Post {
  id: string;
  slug: string;
  title: string;
  markdown?: string;
  createdAt: string;
  updatedAt: string;
  posts?: Post[];
}

type LoaderData = {
  title?: string;
  html: string;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;
  invariant(slug, "slug is required");
  const post = (await getPost(slug)) as Post | null;
  const html = marked(post?.markdown as string);
  return json<LoaderData>({ title: post?.title, html });
};

export default function PostRoute() {
  const { title, html } = useLoaderData();
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="mt-2 border-b-2 text-center text-3xl">{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </main>
  );
}
