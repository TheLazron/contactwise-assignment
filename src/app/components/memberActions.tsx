import { DotsVerticalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropDownMenu";
import {
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@radix-ui/react-dropdown-menu";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import ManagePermissionModal from "./managePermissionModal";
import { Permissions, Role } from "@prisma/client";
import { FC } from "react";
import { useRouter } from "next/navigation";

interface MemberActionsProps {
  memberId: string;
  currentUser: {
    role: Role;
    permissions: Permissions[];
  };
}
("");
const AdminOrgActions: FC<MemberActionsProps> = ({ memberId, currentUser }) => {
  const router = useRouter();
  const removeUser = api.member.removeMember.useMutation({});
  const changeRole = api.member.changeRole.useMutation({});
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          tabIndex={0}
          role="button"
          className="btn-sm m-1 flex items-center justify-center"
        >
          <DotsVerticalIcon className="h-4 " />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {currentUser.permissions.includes("KICK_USERS") && (
            <DropdownMenuItem
              onClick={() => {
                toast.promise(removeUser.mutateAsync({ memberId }), {
                  loading: "Removing user...",
                  success: "User removed successfully",
                  error(error) {
                    return `Error: ${(error as Error).message}`;
                  },
                });
                removeUser.mutate({ memberId: memberId });
              }}
            >
              Kick User
            </DropdownMenuItem>
          )}

          <DropdownMenuSub>
            {currentUser.permissions.includes("CHANGE_ROLES") && (
              <>
                <DropdownMenuSubTrigger>Change Role</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => {
                        toast.promise(
                          changeRole.mutateAsync({ memberId, role: "manager" }),
                          {
                            loading: "Changing role...",
                            success(data) {
                              router.refresh();
                              return `Role changed to Manager`;
                            },
                            error(error) {
                              return `Error: ${(error as Error).message}`;
                            },
                          },
                        );
                      }}
                    >
                      Manager
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        toast.promise(
                          changeRole.mutateAsync({ memberId, role: "user" }),
                          {
                            loading: "Changing role...",
                            success(data) {
                              router.refresh();
                              return `Role changed to User`;
                            },
                            error(error) {
                              return `Error: ${(error as Error).message}`;
                            },
                          },
                        );
                      }}
                    >
                      User
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </>
            )}
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminOrgActions;
