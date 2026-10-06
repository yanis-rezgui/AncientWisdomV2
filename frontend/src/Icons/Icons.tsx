// components/Icon.tsx
import React from "react";
import * as Icons from "lucide-react";

type IconName = keyof typeof Icons;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  color?: string;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  color = "currentColor",
  ...props
}) => {
  const LucideIcon = Icons[name] as React.ElementType;

  if (!LucideIcon) return null;

  return <LucideIcon size={size} color={color} {...props} />;
};

export default Icon;