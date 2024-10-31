import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { account } from "@/lib/appwrite/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppwriteException } from "appwrite";
import { Eye, Mail } from "react-feather";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";

// Define Zod schema for validation
const schema = z.object({
  email: z.string().min(6).max(35).email("Invalid email address").optional(),
  password: z.string().min(8).max(16).optional(),
});

type FormValues = z.infer<typeof schema>;

const ForgotPasswordPage = () => {
  const {
    register: forgotPassword,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const [params] = useSearchParams();

  const onSubmit = async (formData: FormValues) => {
    try {
      // send confirmation request
      if (formData.email) {
        const token = await account.createRecovery(
          formData.email,
          window.location.href
        );
        if (!token) throw AppwriteException;
        toast({
          title: "Link sent",
          description: "Password reset link sent to your email.",
        });
      }
      // updating password
      else if (params.get("userId") && formData.password) {
        const userId = params.get("userId") as string;
        const secret = params.get("secret") as string;

        const token = await account.updateRecovery(
          userId,
          secret,
          formData.password
        );
        if (!token) throw AppwriteException;
        toast({
          title: "Password Recovered",
          description: "Your password has been reset.",
        });
        navigate("/auth/login");
      }
    } catch (error: any) {
      toast({
        title: "Failed to Reset Password",
        description: error.message.toString(),
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {params.get("userId") && params.get("secret") ? (
          <IconInput
            icon={Eye}
            type="password"
            placeholder="Password"
            error={errors.password}
            {...forgotPassword("password")}
          />
        ) : (
          <IconInput
            icon={Mail}
            placeholder="Email"
            error={errors.email}
            {...forgotPassword("email")}
          />
        )}

        <Button className="w-full" type="submit">
          Submit
        </Button>

        <div className="text-center">
          Back to{" "}
          <Link className="text-primary" to="/auth/login">
            Login
          </Link>
        </div>
      </form>
    </>
  );
};

export default ForgotPasswordPage;
