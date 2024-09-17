import Loading from "@/components/loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const userData: any = useSelector((state: RootState) => state.auth.user);

  return (
    <>
      {userData ? (
        <section className="container">
          <div className="w-full flex flex-col items-center gap-4">
            <Avatar className="w-40 h-40">
              <AvatarImage src={userData.imageUrl} alt="@profile image" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="text-center">
              <p className="text-xl font-bold capitalize">{userData.name}</p>
              <p className="text-zinc-400">{userData.email}</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <form action="" className="w-full space-y-4">
              <div>
                <Label>User Id</Label>
                <Input
                  type="text"
                  name="id"
                  value={userData.$id}
                  className="bg-background"
                  disabled
                />
              </div>
              <div>
                <Label>Role</Label>
                <Input
                  type="text"
                  name="role"
                  value={userData.role}
                  className="bg-background"
                  disabled
                />
              </div>
              <div>
                <Label>Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={userData.name}
                  className="bg-background"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={userData.email}
                  className="bg-background"
                />
              </div>
            </form>
          </div>
        </section>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default ProfilePage;
