import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createPost, getPost } from "~/models/post.server";
import { requireAdminUser } from "~/session.server";
import { marked } from "marked";
import invariant from "tiny-invariant";

const inputClassName = `w-full rounded border border-gray-500 px-2 py-2`;

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

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireAdminUser(request);
  if (params.slug == "new") {
    return json({});
  } else {
    const { slug } = params;
    invariant(slug, "slug is required");
    const post = (await getPost(slug)) as Post | null;
    const html = marked(post?.markdown as string);
    console.log(post);
    return json<LoaderData>({ title: post?.title, html });
  }
};

type ActionData =
  | {
      title: null | string;
      slug: null | string;
      markdown: null | string;
    }
  | undefined;

type Request = {
  title: string;
  slug: string;
  markdown: string;
};

export const action: ActionFunction = async ({ request, params }) => {
  const data = Object.fromEntries(await request.formData()) as Request;
  const { title, slug, markdown } = data;

  await requireAdminUser(request);

  const errors: ActionData = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };

  const hasErrors = Object.values(errors).some((error) => error);

  if (hasErrors) {
    return json<ActionData>(errors);
  }

  if (params.slug === "new") {
    await createPost({ title, slug, markdown });
  } else {
    // todo update post
  }

  return redirect("posts/admin");
};

export default function NewPostRoute() {
  const transition = useTransition();
  const isCreating = Boolean(transition.submission);
  const errors = useActionData() as ActionData;
  const { title, html } = useLoaderData();
  return (
    <>
      {title}
      {html}
      {/* <Link to="../">Go back</Link> */}
      <Form method="post" className="w-full">
        <p>
          <label htmlFor="title">
            Post Title:{" "}
            {errors?.title ? (
              <em className="text-red-500">{errors?.title}</em>
            ) : null}
            <input type="text" name="title" className={inputClassName} />
          </label>
        </p>

        <p>
          <label htmlFor="slug">
            Post Slug:
            {errors?.slug ? (
              <em className="text-red-500">{errors?.slug}</em>
            ) : null}
            <input type="text" name="slug" className={inputClassName} />
          </label>
        </p>
        <p>
          <label htmlFor="markdown">
            Markdown:
            {errors?.markdown ? (
              <em className="text-red-500">{errors?.markdown}</em>
            ) : null}
            <textarea rows={8} name="markdown" className={inputClassName} />
          </label>
        </p>
        {/* We can either disable, or hide it completely with isCreating */}
        {isCreating ? (
          ""
        ) : (
          <input
            className="btn-primary pointer rounded bg-blue-500 p-2 px-6 text-white"
            type="submit"
            value="Create Post"
          />
        )}
      </Form>
    </>
  );
}
