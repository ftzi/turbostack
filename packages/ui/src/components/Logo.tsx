import LogoComponentSvg from "@/lib/resources/logo.svg";
import type { SVGProps } from "react";

export const Logo = (props: SVGProps<SVGElement>) => (
  <LogoComponentSvg
    height={30}
    shapeRendering={"geometricPrecision"}
    {...props}
  />
);
