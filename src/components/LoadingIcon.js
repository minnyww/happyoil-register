import { LoadingOutlined } from "@ant-design/icons";

export default function LoadingIcon() {
   return (
      <LoadingOutlined
         style={{
            color: "#005219",
            fontSize: "3rem",
            width: "100vw",
            zIndex: "99999",
            position: "absolute",
         }}
      />
   );
}
