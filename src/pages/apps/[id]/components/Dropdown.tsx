import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import React from "react";

interface props {
  value: any;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  options: { label: JSX.Element | string; value: any }[];
}

export const Dropdown = ({ value, setValue, options }: props): JSX.Element => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button className=" bg-transparent hover:bg-white">
        {options.find((opt) => opt.value === value)?.label ?? "None"}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="z-10 mt-3 rounded-md bg-white/20 p-2 backdrop-blur-md">
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup
        value={value}
        onValueChange={(e) => setValue(e.valueOf())}
      >
        {options.map((option) => (
          <DropdownMenuRadioItem className="p-1" value={option.value}>
            {option.label}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);
