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
import { toast } from "sonner";
import { z } from "zod";
import { api } from "~/trpc/react";

interface ModalWrapperProps {
  orgId: string;
  initialData: {
    bannerImg: string;
    name: string;
    description: string;
  };
}

type EditOrgSchemaType = z.infer<typeof editOrganisationSchema>;

const EditOrgModal: FC<ModalWrapperProps> = ({ orgId, initialData }) => {
  const editOrganisation = api.organisation.editOrg.useMutation();
  const utils = api.useUtils();

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
  } = useForm<EditOrgSchemaType>({
    defaultValues: { orgId: orgId, ...initialData },
    resolver: zodResolver(createOrganisationSchema),
  });

  const bannerImgUrl = watch("bannerImg");

  const onSubmit: SubmitHandler<EditOrgSchemaType> = async (data) => {
    const promise = editOrganisation.mutateAsync({ ...data, orgId: orgId });
    toast.promise(promise, {
      loading: "Making Changes...",
      success: (data) => {
        closeModal();
        return `${data.name} has been updated successfully!`;
      },
      finally: async () => {
        await utils.organisation.getOrg.invalidate();
      },
      error(error) {
        closeModal();
        return `Error: ${(error as Error).message}`;
      },
    });
  };

  return (
    <>
      <button onClick={openModal} className="btn btn-circle btn-sm">
        <Pencil1Icon />
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <button
            onClick={closeModal}
            className="btn btn-circle btn-primary btn-sm absolute right-2 top-2"
          >
            ✕
          </button>
          <div>
            <h1 className="w-full text-xl font-bold leading-tight tracking-tight text-accent">
              Edit Organisation
            </h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-2 w-full  space-y-4 md:space-y-3"
            >
              <div>
                <span className="mb-2 block text-sm font-medium text-primary-content">
                  Organisation Name
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
                  Organisation Description
                </span>
                <label className="input flex w-full items-center gap-2 rounded-lg border border-accent bg-base-200 p-2.5 text-sm font-medium text-primary-content focus:border-primary focus:ring-primary sm:text-sm ">
                  <ReaderIcon />
                  <input
                    {...register("description")}
                    type="text"
                    name="description"
                    id="description"
                    className="grow"
                    placeholder="Organisation Description"
                  />
                </label>
                {errors.description && (
                  <p className="text-error">{errors.description.message}</p>
                )}
              </div>
              <div>
                <span className="mb-2 block text-sm font-medium text-primary-content">
                  Organisation Banner
                </span>
                <div className="align-items-stretch flex gap-2">
                  <div className="md:4/5 sm:1/2 lg:w-3/5">
                    <label className="input  flex w-full items-center gap-2 rounded-lg border border-accent bg-base-200 p-2.5 text-sm font-medium text-primary-content focus:border-primary focus:ring-primary sm:text-sm ">
                      <Link2Icon />
                      <input
                        {...register("bannerImg")}
                        type="url"
                        name="bannerImg"
                        id="bannerImg"
                        className="grow"
                        placeholder="Organisation Banner URL"
                      />
                    </label>
                  </div>
                  <div className="my-0 flex h-12 flex-1 items-center justify-center  rounded-lg border border-accent bg-base-200 ">
                    {bannerImgUrl && (
                      <img
                        src={bannerImgUrl}
                        alt="Organisation Banner"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                </div>
                {errors.bannerImg && <p className="text-error">{}</p>}
              </div>
              <button type="submit" className="btn btn-primary w-full">
                Make Changes
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default EditOrgModal;
