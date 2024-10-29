import LoginForm from "./form";

const Login = () => {
  return (
    <section className="container h-full flex flex-col">
      <div className="text-center mt-8">
        <h1 className="text-4xl font-bold font-amster tracking-wider">
          {import.meta.env.VITE_APP_NAME}
        </h1>
        <p className="text-zinc-400">Login to begin where you left-off.</p>
      </div>

      {/* login form component */}
      <LoginForm />
    </section>
  );
};

export default Login;
