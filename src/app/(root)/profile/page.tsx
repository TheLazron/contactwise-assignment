import { Pencil1Icon } from "@radix-ui/react-icons";
import EditProfileModal from "~/app/components/editProfileModal";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

const ProfilePage = async () => {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const data = await api.user.getProfileDetails();
  return (
    <div className="container mt-24 flex min-h-screen flex-col gap-4  bg-base-100 bg-opacity-70 px-0 py-10">
      <div className="card card-compact relative h-44 w-full overflow-hidden bg-base-100 shadow-xl ">
        <div className="absolute z-0 h-full w-full bg-polka-pattern"></div>
        <div className="absolute h-full w-full bg-black bg-opacity-5"></div>
        <div className="icenter card-body z-20 justify-center text-base-100 ">
          <div className="flex flex-col items-center gap-5 md:flex-row">
            <div className="avatar relative">
              <EditProfileModal
                initialData={{ image: data.image, name: data.name }}
              />
              <div className="h-16 w-16 rounded-full ring-2 ring-primary md:h-24 md:w-24">
                <img
                  src={data.image}
                  alt="user profile page"
                  className=" object-cover"
                />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-accent md:text-5xl">
                {data.name}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
