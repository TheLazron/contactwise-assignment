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
import { useRouter } from "next/navigation";
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
  children: React.ReactNode;
}

type EditOrgSchemaType = z.infer<typeof editOrganisationSchema>;

const DeleteOrgModal: FC<ModalWrapperProps> = ({ children, orgId }) => {
  const router = useRouter();

  // const deleteOrganisation = api.organisation.deleteOrganisation.useMutation({
  //   onSuccess: () => {
  //     closeModal();
  //     router.push("/dashboard");
  //     toast.success("Organisation Deleted Successfully");
  //   },
  //   onError: (error) => {
  //     closeModal();
  //     toast.error(error.message);
  //   },
  // });
  const deleteOrganisation = api.organisation.deleteOrganisation.useMutation();

  const openModal = () => {
    const modal = document.getElementById("deleteModal") as HTMLDialogElement;
    modal?.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById("deleteModal") as HTMLDialogElement;
    modal?.close();
  };

  return (
    <>
      <div onClick={openModal}>{children}</div>
      <dialog id="deleteModal" className="modal">
        <div className="modal-box flex flex-col gap-2">
          <div>
            <h1 className="w-full text-xl font-bold leading-tight tracking-tight text-accent">
              Delete Organisation
            </h1>
            <p className="text-sm text-secondary-content">
              This action cannot be undone. Proceed with deletion?
            </p>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => {
                toast.promise(
                  deleteOrganisation.mutateAsync({ orgId: orgId }),
                  {
                    loading: "Deleting Organisation",
                    success(data) {
                      closeModal();
                      router.push("/dashboard");
                      return "Organisation Deleted Successfully";
                    },
                    error(error) {
                      closeModal();
                      return `Error: ${(error as Error).message}`;
                    },
                  },
                );
              }}
              className="btn btn-error btn-sm"
            >
              Delete
            </button>
            <button onClick={closeModal} className="btn btn-primary btn-sm">
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default DeleteOrgModal;
