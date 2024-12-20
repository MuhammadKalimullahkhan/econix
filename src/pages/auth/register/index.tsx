import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/input";
import { EMAIL_REGEX, NAME_REGEX } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { getAccount } from "@/lib/appwrite/api";
import { useCreateUserAccount } from "@/lib/react-query/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppwriteException } from "appwrite";
import { Eye, Mail, User } from "react-feather";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

// Define Zod schema for validation
const loginSchema = z.object({
  name: z
    .string()
    .regex(
      NAME_REGEX,
      "Name is invalid. Name must contain only capital and small letters."
    )
    .min(4, "Name must be at least 4 characters"),
  email: z
    .string()
    .regex(
      EMAIL_REGEX,
      "Email is invalid. Only one '@' is allowed, and only '-', '_', and '.' are valid special symbols."
    )
    .min(2)
    .max(35)
    .email("Invalid email address"),
  password: z.string().min(8).max(16, "Password must be 16 characters."),
});

type RegisterFormValues = z.infer<typeof loginSchema>;

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  // Queries
  const { mutateAsync: createUserAccount, isPending: isCreatingUser } =
    useCreateUserAccount();

  const onSubmit = async (user: RegisterFormValues) => {
    try {
      const newUser = await createUserAccount(user);
      const userAccount = await getAccount();

      localStorage.setItem("myuserdata", JSON.stringify(userAccount));

      if (!newUser) throw AppwriteException;

      toast({
        title: "Registeration Success",
        description: "Please verify your email address.",
      });

      return navigate("/confirm-email");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registeration Failed",
        description: error.message.toString(),
      });
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

          <Button className="w-full" type="submit" disabled={isCreatingUser}>
            {isCreatingUser ? <Loading /> : "Sign Up"}
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

export default RegisterPage;
