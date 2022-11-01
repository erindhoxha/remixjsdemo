import { NavLink } from "@remix-run/react";

export default function AdminIndexRoute() {
  return (
    <>
      <NavLink to="new" className="rounded bg-red-500 p-2 text-sm text-white">
        Create new post
      </NavLink>
    </>
  );
}
