import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser } from "@/lib/appwrite/api";
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queries";
import { login } from "@/redux/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Mail, User } from "react-feather";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

// Define Zod schema for validation
const loginSchema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters"),
  email: z.string().min(2).max(35).email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof loginSchema>;

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Queries
  const { mutateAsync: createUserAccount, isPending: isCreatingUser } =
    useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSigninUser } =
    useSignInAccount();

  const onSubmit = async (user: RegisterFormValues) => {
    try {
      const newUser = await createUserAccount(user);
      if (!newUser) {
        toast({ title: "Sign up failed. Please try again." });
      }
      const session = await signInAccount({
        email: user.email,
        password: user.password,
      });
      if (!session) {
        toast({ title: "Something went wrong. Please login your new account" });
        return navigate("/auth/login");
      }
      const currentUser = await getCurrentUser();
      dispatch(login(currentUser));

      return navigate("/");
    } catch (error: any) {
      toast({ title: "Login Failed", description: error.message.toString() });
    }
  };

  return (
    <>
      <div className="my-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <IconInput
            icon={User}
            placeholder="Name"
            error={errors.name}
            {...register("name")}
          />

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

          <Button
            className="w-full"
            type="submit"
            disabled={isCreatingUser || isSigninUser}
          >
            {isCreatingUser || isSigninUser ? <Loading /> : "Sign Up"}
          </Button>

          <div className="text-center">
            Already have any account?{" "}
            <Link className="text-primary" to="/auth/login">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegisterForm;
