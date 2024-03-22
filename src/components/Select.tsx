import { Badge } from "@/components/ui/badge";
import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface props {
  value: any;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  options: { label: JSX.Element | string; value: any }[];
}

export default function Select({ value, setValue, options }: props): JSX.Element {
  return (
    <ShadSelect value={value} onValueChange={setValue}>
      <SelectTrigger className="border-none bg-transparent">
        <SelectValue
          placeholder={
            <Badge className="w-5/12 min-w-24 justify-center">All</Badge>
          }
        />
      </SelectTrigger>
      <SelectContent className="mt-2 border-none bg-white/20 backdrop-blur hover:bg-white/20">
        <SelectItem value=" ">
          <Badge className="w-5/12 min-w-24 justify-center">All</Badge>
        </SelectItem>
        {options?.map((option) => (
          <SelectItem key={`${option.value}`} value={option.value}>
            <Badge className="w-5/12 min-w-24 justify-center text-center">
              {option.label}
            </Badge>
          </SelectItem>
        ))}
      </SelectContent>
    </ShadSelect>
  );
}
