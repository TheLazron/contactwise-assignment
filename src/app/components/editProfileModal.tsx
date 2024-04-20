/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Link2Icon,
  Pencil1Icon,
  ReaderIcon,
  TargetIcon,
} from "@radix-ui/react-icons";
import React, { FC, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  createOrganisationSchema,
  editOrganisationSchema,
} from "schemas/organisationSchemas";
import { editProfileSchema } from "schemas/userSchemas";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "~/trpc/react";

interface EditProfileModalProps {
  initialData: {
    image: string;
    name: string;
  };
}

type EditProfileSchemaType = z.infer<typeof editProfileSchema>;

const EditProfileModal: FC<EditProfileModalProps> = ({ initialData }) => {
  const editProfile = api.user.editProfile.useMutation({
    onSuccess: () => {
      closeModal();
      toast.success("Data saved successfully!");
    },
    onError: (error) => {
      closeModal();
      toast.error(error.message);
    },
  });

  const openModal = () => {
    const modal = document.getElementById("my_modal_1") as HTMLDialogElement;
    modal?.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById("my_modal_1") as HTMLDialogElement;
    modal?.close();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<EditProfileSchemaType>({
    defaultValues: { ...initialData },
    resolver: zodResolver(editProfileSchema),
  });

  const profileImageUrl = watch("image");

  const onSubmit: SubmitHandler<EditProfileSchemaType> = (data) => {
    console.log("data", data);
    editProfile.mutate({ ...data });
  };

  return (
    <>
      <button
        onClick={openModal}
        className="btn btn-circle btn-accent btn-sm absolute bottom-0 right-0 z-10"
      >
        <Pencil1Icon />
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <div>
            <h1 className="w-full text-xl font-bold leading-tight tracking-tight text-accent">
              Create New Organisation
            </h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-2 w-full  space-y-4 md:space-y-3"
            >
              <div>
                <span className="mb-2 block text-sm font-medium text-primary-content">
                  User Name
                </span>
                <label className="input flex w-full items-center gap-2 rounded-lg border border-accent bg-base-200 p-2.5 text-sm font-medium text-primary-content focus:border-primary focus:ring-primary sm:text-sm ">
                  <TargetIcon />
                  <input
                    {...register("name")}
                    type="text"
                    name="name"
                    id="name"
                    className="grow"
                    placeholder="Organisation Name"
                  />
                </label>
                {errors.name && (
                  <p className="text-error">{errors.name.message}</p>
                )}
              </div>
              <div>
                <span className="mb-2 block text-sm font-medium text-primary-content">
                  Profile Image
                </span>
                <div className="align-items-stretch flex gap-2">
                  <div className="md:4/5 sm:1/2 lg:w-3/5">
                    <label className="input  flex w-full items-center gap-2 rounded-lg border border-accent bg-base-200 p-2.5 text-sm font-medium text-primary-content focus:border-primary focus:ring-primary sm:text-sm ">
                      <Link2Icon />
                      <input
                        {...register("image")}
                        type="url"
                        name="image"
                        id="image"
                        className="grow"
                        placeholder="Organisation Banner URL"
                      />
                    </label>
                  </div>
                  <div className="my-0 flex h-12 flex-1 items-center justify-center  rounded-lg border border-accent bg-base-200 ">
                    {profileImageUrl && (
                      <img
                        src={profileImageUrl}
                        alt="Organisation Banner"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                </div>
                {errors.image && (
                  <p className="text-error">{errors.image.message}</p>
                )}
              </div>
              <button type="submit" className="btn btn-primary w-full">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default EditProfileModal;
