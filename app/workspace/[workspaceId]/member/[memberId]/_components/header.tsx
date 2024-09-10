"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";

interface HeaderProps {
  name?: string;
  image?: string;
  onClick?: () => void;
}

export const Header = ({ name = "Member", image, onClick }: HeaderProps) => {
  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <Button
        variant={"ghost"}
        size={"sm"}
        className="text-lg font-semibold px-2 overflow-hidden w-auto"
        onClick={onClick}
      >
        <Avatar className="size-6 rounded-md mr-2">
          <AvatarImage src={image} className="rounded-md" />
          <AvatarFallback className="rounded-md bg-sky-500 text-white">
            {name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="truncate">{name}</span>
        <FaChevronDown className="size-2.5 ml-2" />
      </Button>
    </div>
  );
};
