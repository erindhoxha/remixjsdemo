import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  createPost,
  deletePost,
  getPost,
  updatePost,
} from "~/models/post.server";
import { requireAdminUser } from "~/session.server";
import { marked } from "marked";
import invariant from "tiny-invariant";

const inputClassName = `w-full rounded border border-gray-300 px-2 py-2`;

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
  slug: string | undefined;
  markdown: string | undefined;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireAdminUser(request);
  if (params.slug === "new") {
    return json({});
  } else {
    const { slug } = params;
    invariant(slug, "slug is required");
    const post = (await getPost(slug)) as Post | null;
    const html = marked(post?.markdown as string);
    return json<LoaderData>({
      title: post?.title,
      html,
      slug: post?.slug,
      markdown: post?.markdown,
    });
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
  intent?: string;
};

export const action: ActionFunction = async ({ request, params }) => {
  const data = Object.fromEntries(await request.formData()) as Request;
  const { title, slug, markdown, intent } = data;

  if (intent === "delete") {
    await deletePost(params.slug);
    return redirect("/posts/admin");
  }

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

  if (slug === "new") {
    await createPost({ title, slug, markdown });
  } else {
    await updatePost({ slug, title, markdown }, params.slug);
  }

  return redirect("posts/admin");
};

export default function NewPostRoute() {
  const transition = useTransition();
  const isCreating = transition.submission?.formData.get("intent") === "create";
  const isUpdating = transition.submission?.formData.get("intent") === "update";
  const isDeleting = transition.submission?.formData.get("intent") === "delete";
  const data = useLoaderData();
  const { title, markdown, slug } = data;
  const isNewPost = !slug;
  const errors = useActionData() as ActionData;
  return (
    <>
      <div className="article mb-4 mt-4">
        {title ? (
          <h1 className="text-2xl">Update post:</h1>
        ) : (
          <h1 className="text-2xl">Create post:</h1>
        )}
      </div>
      {/* <Link to="../">Go back</Link> */}
      <Form method="post" className="w-full" key={slug ?? "new"}>
        <p className="mb-4">
          <label htmlFor="title">
            Post Title:{" "}
            {errors?.title ? (
              <em className="text-red-500">{errors?.title}</em>
            ) : null}
            <input
              placeholder={title ?? title}
              defaultValue={title ?? title}
              type="text"
              name="title"
              className={inputClassName}
            />
          </label>
        </p>

        <p className="mb-4">
          <label htmlFor="slug">
            Post Slug:
            {errors?.slug ? (
              <em className="text-red-500">{errors?.slug}</em>
            ) : null}
            <input
              placeholder={slug ?? slug}
              defaultValue={slug ?? slug}
              type="text"
              name="slug"
              className={inputClassName}
            />
          </label>
        </p>
        <p>
          <label htmlFor="markdown">
            Markdown:
            {errors?.markdown ? (
              <em className="text-red-500">{errors?.markdown}</em>
            ) : null}
            <textarea
              placeholder={markdown ?? markdown}
              defaultValue={markdown ?? markdown}
              rows={8}
              name="markdown"
              className={inputClassName}
            />
          </label>
        </p>
        {/* We can either disable, or hide it completely with isCreating */}
        <div className="flex">
          {isCreating ? (
            ""
          ) : (
            <button
              type="submit"
              name="intent"
              value={isNewPost ? "create" : "update"}
              className="rounded bg-blue-500 py-2 px-4 text-white transition hover:bg-blue-700"
              disabled={isCreating || isUpdating}
            >
              {isNewPost ? (isCreating ? "Creating..." : "Create Post") : null}
              {isNewPost ? null : isUpdating ? "Updating..." : "Update Post"}
            </button>
          )}
          {isNewPost ? null : (
            <button
              type="submit"
              name="intent"
              value="delete"
              className="ml-2 rounded bg-red-500 py-2 px-4 text-white transition hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}

          {!isNewPost ? (
            <Link
              className="btn-secondary pointer ml-auto ml-2 rounded p-2 px-6 text-black"
              to="/posts/admin/new"
            >
              + Create Post
            </Link>
          ) : (
            ""
          )}
        </div>
      </Form>
    </>
  );
}
