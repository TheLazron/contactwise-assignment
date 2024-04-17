"use client";

import * as React from "react";
import { z } from "zod";
import { useEffect } from "react";
import Link from "next/link";

import { cn } from "~/lib/cn";
// import { Icons } from "@/components/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../components/ui/navigation-menu";
import ModalWrapper from "./createOrgModal";
import {
  createOrganisationSchema,
  joinOrganisationSchema,
} from "schemas/organisationSchemas";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link2Icon, ReaderIcon, TargetIcon } from "@radix-ui/react-icons";
import { api } from "~/trpc/react";

export function NavigationMenuDemo() {
  const [closeModal, setCloseModal] = React.useState(false);
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Join Organisation</NavigationMenuTrigger>
          <NavigationMenuContent>
            {/* <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]"> */}
            <div className="flex items-center p-2">
              <JoinNewOrgForm />
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={`${navigationMenuTriggerStyle()} bg-primary hover:bg-primary hover:bg-opacity-85`}
          >
            {/* <h1>Hello</h1> */}
            <ModalWrapper btnText="Create Organisation" closeModal={closeModal}>
              <CreateNewOrgForm setCloseModal={setCloseModal} />
            </ModalWrapper>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

type CreateOrgSchemaType = z.infer<typeof createOrganisationSchema>;

const JoinNewOrgForm = () => {
  const [orgCode, setOrgCode] = React.useState<string>("");

  const joinOrganisation = api.organisation.joinOrg.useMutation({});

  const joinOrg = () => {
    joinOrganisation.mutate({ code: orgCode });
  };

  useEffect(() => {
    if (orgCode.length == 5) {
      toast.promise(joinOrganisation.mutateAsync({ code: orgCode }), {
        loading: "Joining Organisation...",
        success: (data) => {
          return `Successfully joined org ${data.name}`;
        },
        error:
          "Failed to join organisation. Please check the code and try again.",
      });
    }
  }, [orgCode]);

  return (
    <>
      <h1 className="w-36 text-sm font-semibold ">Enter Org Join Code:</h1>
      <input
        onChange={(e) => setOrgCode(e.target.value)}
        type="text"
        placeholder="Enter Organisation #"
        className="input input-sm input-bordered  flex-1 "
      />
    </>
  );
};

const CreateNewOrgForm = ({
  setCloseModal,
}: {
  setCloseModal: (closeModal: boolean) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateOrgSchemaType>({
    resolver: zodResolver(createOrganisationSchema),
  });

  const createOrganisation = api.organisation.createOrg.useMutation({
    onSuccess: () => {
      setCloseModal(true);
      toast.success("Organisation Created Successfully");
    },
    onError: (error) => {
      setCloseModal(true);
      toast.error(error.message);
    },
  });

  const bannerImgUrl = watch("bannerImg");
  const onSubmit: SubmitHandler<CreateOrgSchemaType> = async (data) => {
    createOrganisation.mutate(data);
    setCloseModal(false);
  };

  return (
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
          {errors.name && <p className="text-error">{errors.name.message}</p>}
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
          {errors.bannerImg && (
            <p className="text-error">{errors.bannerImg.message}</p>
          )}
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Create Organisation
        </button>
      </form>
    </div>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "hover:text-accent-foreground focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent focus:bg-accent",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
