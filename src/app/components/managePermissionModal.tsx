"use client";

import { Permissions } from "@prisma/client";
import { FC, useEffect, useState } from "react";
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

  useEffect(() => {
    setValue("permissions", {
      EDIT_ORG: initialPermissions.includes("EDIT_ORG"),
      KICK_USERS: initialPermissions.includes("KICK_USERS"),
      CHANGE_ROLES: initialPermissions.includes("CHANGE_ROLES"),
    });
  }, [initialPermissions, setValue]);

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
          <button
            onClick={closeModal}
            className="btn btn-circle btn-primary btn-sm absolute right-2 top-2"
          >
            ✕
          </button>
          <div>
            <h1 className="w-full text-xl font-bold leading-tight tracking-tight text-accent">
              Manage User Permission
            </h1>
            <p className="text-sm text-secondary-content">
              Manage Permissions for the user.
            </p>
            <div className="mt-4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className=" mb-2 flex w-full flex-col justify-between sm:flex-row">
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      className=" checkbox-primary checkbox"
                      {...register("permissions.EDIT_ORG")}
                    />
                    <span className="label-text font-semibold">EDIT ORG</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      id="checkbox2"
                      type="checkbox"
                      className=" checkbox-primary checkbox"
                      {...register("permissions.KICK_USERS")}
                    />
                    <span className="label-text font-semibold">KICK USERS</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      className=" checkbox-primary checkbox"
                      {...register("permissions.CHANGE_ROLES")}
                    />
                    <span className="label-text font-semibold">
                      CHANGE ROLES
                    </span>
                  </div>
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
