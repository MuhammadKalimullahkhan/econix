import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Mail } from "react-feather";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSignInAccount } from "@/lib/react-query/queries";
import { login } from "@/redux/authSlice";
import { getCurrentUser } from "@/lib/appwrite/api";

// Define Zod schema for validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Query
  const { mutateAsync: signInAccount, isPending: isUserLoading } =
    useSignInAccount();

  const onSubmit = async (user: LoginFormValues) => {
    try {
      // singin to account
      const session = await signInAccount(user);
      const currentUser = await getCurrentUser();

      if (!currentUser) throw Error;

      if (session && currentUser.verified) {
        // updating user state
        dispatch(login(currentUser));

        toast({ title: "Login Success" });
        return navigate("/");
      } else {
        toast({
          description:
            "invalid credentials. Please check the email and password.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
      });
    }
  };

  return (
    <>
      <div className="my-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <IconInput
            icon={Mail}
            placeholder="Email"
            error={errors.email}
            {...register("email")}
          />

          <IconInput
            icon={Eye}
            type="password"
            placeholder="Password"
            error={errors.password}
            {...register("password")}
          />

          {/* <p className="text-right">
            <Link to={"/auth/forgot-password"}>Forgot Password?</Link>
          </p> */}

          <Button className="w-full" type="submit" disabled={isUserLoading}>
            {!isUserLoading ? "Sign In" : <Loading />}
          </Button>

          <div className="text-center">
            Didn’t have any account?{" "}
            <Link className="text-primary" to="/auth/register">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
