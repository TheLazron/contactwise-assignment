"use client";

import { Permissions } from "@prisma/client";
import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  changePermissisonsRequestSchema,
  changePermissisonsSchema,
} from "schemas/memberSchemas";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "~/trpc/react";

interface ManagePermissionModalProps {
  children: React.ReactNode;
  initialPermissions: Permissions[];
  memberId: string;
}

type ManagePermissionModalSchemaType = z.infer<typeof changePermissisonsSchema>;

const ManagePermissionModal: FC<ManagePermissionModalProps> = ({
  children,
  initialPermissions,
  memberId,
}) => {
  const openModal = () => {
    const modal = document.getElementById(`${memberId}`) as HTMLDialogElement;
    modal?.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById(`${memberId}`) as HTMLDialogElement;
    modal?.close();
  };

  const changePermissions = api.member.changePermissions.useMutation({});
  //   const changePermissions = api.member.changePermissions.useMutation({
  //     onSuccess: () => {
  //       closeModal();
  //       toast.success("Changes made successfully");
  //     },
  //     onError: (error) => {
  //       closeModal();
  //       toast.error(error.message);
  //     },
  //   });

  const { register, handleSubmit, setValue, watch } =
    useForm<ManagePermissionModalSchemaType>({
      defaultValues: {
        permissions: {
          EDIT_ORG: initialPermissions.includes("EDIT_ORG"),
          KICK_USERS: initialPermissions.includes("KICK_USERS"),
          CHANGE_ROLES: initialPermissions.includes("CHANGE_ROLES"),
        },
      },
    });

  const onSubmit: SubmitHandler<ManagePermissionModalSchemaType> = (data) => {
    const changePermissionsData: z.infer<
      typeof changePermissisonsRequestSchema
    > = {
      memberId,
      permissions: Object.entries(data.permissions)
        .filter(([key, value]) => value)
        .map(([key]) => key) as Permissions[],
    };
    toast.promise(changePermissions.mutateAsync(changePermissionsData), {
      loading: "Saving changes...",
      success(data) {
        closeModal();
        return "Changes made successfully";
      },
      error: "Failed to save changes",
    });
  };

  return (
    <>
      <div onClick={openModal}>{children}</div>
      <dialog id={`${memberId}`} className="modal">
        <div className="modal-box flex flex-col gap-2">
          <div>
            <h1 className="w-full text-xl font-bold leading-tight tracking-tight text-accent">
              Manage User Permission
            </h1>
            <p className="text-sm text-secondary-content">
              Manage Permissions for the user.
            </p>
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <input
                    type="checkbox"
                    {...register("permissions.EDIT_ORG")}
                  />
                  <label htmlFor="checkbox1">EDIT_ORG</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    {...register("permissions.KICK_USERS")}
                  />
                  <label htmlFor="checkbox2">KICK_USERS</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    {...register("permissions.CHANGE_ROLES")}
                  />
                  <label htmlFor="checkbox3">CHANGE_ROLES</label>
                </div>
                <button type="submit" className="btn btn-primary w-full">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ManagePermissionModal;
