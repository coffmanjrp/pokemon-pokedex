import { HiChevronDown, HiChevronUp } from "react-icons/hi2";

interface ChevronIconProps {
  className?: string;
}

export const ChevronDownIcon = ({ className }: ChevronIconProps) => (
  <HiChevronDown className={className} />
);

export const ChevronUpIcon = ({ className }: ChevronIconProps) => (
  <HiChevronUp className={className} />
);
