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

const AdminOrgActions = ({ memberId }: { memberId: string }) => {
  const removeUser = api.member.removeMember.useMutation({
    onSuccess: () => {
      toast.success("User removed successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const changeRole = api.member.chanageRole.useMutation({
    onSuccess: (data) => {
      toast.success(`Role changed to ${data.role.toUpperCase()}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
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
          <DropdownMenuItem
            onClick={() => {
              removeUser.mutate({ memberId: memberId });
            }}
          >
            Kick User
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Change Role</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => {
                    changeRole.mutate({ memberId: memberId, role: "manager" });
                  }}
                >
                  Manager
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    changeRole.mutate({ memberId: memberId, role: "user" });
                  }}
                >
                  User
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminOrgActions;
