import { Pencil1Icon } from "@radix-ui/react-icons";
import EditProfileModal from "~/app/components/editProfileModal";
import { api } from "~/trpc/server";

const ProfilePage = async () => {
  const data = await api.user.getProfileDetails();
  return (
    <div className="container mt-24 flex min-h-screen flex-col gap-4  bg-base-100 bg-opacity-70 px-0 py-10">
      <div className="card card-compact relative h-44 w-full overflow-hidden bg-base-100 shadow-xl ">
        <div className="absolute z-0 h-full w-full bg-polka-pattern">
          {/* <img className="h-full w-full object-cover" src={""} alt="Shoes" /> */}
        </div>
        <div className="absolute h-full w-full bg-black bg-opacity-5"></div>
        <div className="icenter card-body z-20 justify-center text-base-100 ">
          <div className="flex items-center gap-5">
            <div className="avatar relative">
              <EditProfileModal
                initialData={{ image: data.image!, name: data.name! }}
              />
              <div className="h-24 w-24 rounded-full ring-2 ring-primary">
                <img
                  src={data.image!}
                  alt="user profile page"
                  className=" object-cover"
                />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-semibold text-accent">
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
