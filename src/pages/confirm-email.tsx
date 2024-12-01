import { useToast } from "@/hooks/use-toast";
import { saveUserToDB } from "@/lib/appwrite/api";
import { account, avatars } from "@/lib/appwrite/config";
import { AppwriteException, Models } from "appwrite";
import { Loader } from "react-feather";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

const ConfirmEmail = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  if (!userId || !secret) return <Navigate to={"/auth/login"} />;

  (async () => {
    try {
      const user: Models.User<Models.Preferences> | undefined = JSON.parse(
        localStorage.getItem("myuserdata") as string
      );
      const avatarUrl = avatars.getInitials(user?.name);
      const verified = await account.updateVerification(userId!, secret!);

      if (!verified) throw AppwriteException;

      const newUser = await saveUserToDB({
        id: user?.$id as string,
        name: user?.name as string,
        email: user?.email as string,
        imageUrl: avatarUrl.href,
        verified: true,
      });

      if (!newUser) throw AppwriteException;

      toast({
        title: "Email Verified",
        description: "Registeration success. Your account has been verified.",
      });
      navigate("/auth/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.message as string,
      });
      navigate("/auth/register");
    }
  })();

  return (
    <section className="min-h-screen w-full grid grid-cols-1 place-items-center">
      <div className="flex flex-col items-center gap-3">
        <Loader className="animate-spin" />
        <p>Confirmation is in progress</p>
      </div>
    </section>
  );
};

export default ConfirmEmail;
