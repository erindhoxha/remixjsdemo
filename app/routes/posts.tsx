import { Outlet } from "@remix-run/react";
import React from "react";

export const Posts = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Posts;
