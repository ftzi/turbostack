// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
import { LogoIcon } from "@workspace/ui/components/LogoIcon";
import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};

export default function Favicon() {
  return new ImageResponse(
    <div
      style={{
        // These you can change to your liking.
        background: "black",
        borderRadius: "50%", // 50% is a full circle background.

        // These are required to properly show it.
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LogoIcon
        // color={"#f0f"} // Used in case your `.svg` uses `fill:currentColor` instead of a color value. You can change it to any color you want.
        style={
          {
            // You can control it's size with this
            // padding: "1px",
            // You can control it's positioning with these two
            // top: "1.3px",
            // right: "2.2px",
          }
        }
      />
    </div>,
    {
      ...size,
    },
  );
}

export const contentType = "image/png";
