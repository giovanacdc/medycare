import clsx from "clsx";
import Image from "next/image";

import { StatusIcon } from "@/constants";

export const StatusBadge = ({ status }: { status: Status }) => {
  return (
    <div
      className={clsx("status-badge", {
        "bg-purple-500": status === "agendado",
        "bg-blue-600": status === "aguardando",
        "bg-red-600": status === "cancelado",
      })}
    >
      <Image
        src={StatusIcon[status]}
        alt="doctor"
        width={24}
        height={24}
        className="h-fit w-3"
      />
      <p
        className={clsx("text-12-semibold capitalize", {
          "text-purple-600": status === "agendado",
          "text-blue-500": status === "aguardando",
          "text-red-500": status === "cancelado",
        })}
      >
        {status}
      </p>
    </div>
  );
};