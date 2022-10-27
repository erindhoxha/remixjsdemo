import { NavLink } from "@remix-run/react";

export default function AdminIndexRoute() {
  return (
    <div>
      <NavLink to="new">Create new post</NavLink>
    </div>
  );
}
