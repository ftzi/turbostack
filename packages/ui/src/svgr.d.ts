// https://react-svgr.com/docs/next/
declare module "*.svg" {
  import type { FC, SVGProps } from "react";

  const content: FC<SVGProps<SVGElement>>;

  export default content;
}
