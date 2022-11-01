import { Outlet } from "@remix-run/react";
import Header from "~/components/header";

export const Tada = () => {
  return (
    <div>
      <Header name="tada" />
      <Outlet></Outlet>
    </div>
  );
};

export default Tada;
