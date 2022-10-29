import { Link } from "@remix-run/react";

type Props = {
  name: string | undefined;
};

const Header = (props: Props) => {
  return (
    <header className=" bg-slate-800 p-4 text-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between p-4">
        <h1 className="text-3xl font-bold">
          <Link to="/">Notes</Link>
        </h1>
        <p>Logged in as {props?.name ? props.name : "friend"}</p>
      </div>
    </header>
  );
};

export default Header;
