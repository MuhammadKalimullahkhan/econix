import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <section className="container min-h-screen flex flex-col">
      <div className="text-center mt-8">
        <h1 className="text-4xl font-bold font-amster tracking-wider">
          {import.meta.env.VITE_APP_NAME.toUpperCase()}
        </h1>
        <p className="text-zinc-400">Register to begin a new Journey.</p>
      </div>
      <div className="my-auto">
        <Outlet />
      </div>
    </section>
  );
};

export default AuthLayout;
