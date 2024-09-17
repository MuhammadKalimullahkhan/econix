import RegisterForm from "./form";

const Register = () => {
  return (
    <section className="container h-full flex flex-col">
      <div className="text-center mt-8">
        <h1 className="text-4xl font-bold font-amster tracking-wider">
          Econix
        </h1>
        <p className="text-zinc-400">Register to begin a new Journey.</p>
      </div>

      {/* Register form component */}
      <RegisterForm />
    </section>
  );
};

export default Register;
