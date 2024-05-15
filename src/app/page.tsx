import FilesTable from "@/components/files-table";
import SectionHeader from "@/components/header";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full p-10 gap-5 flex-col flex">
        <SectionHeader />
        <FilesTable />
      </div>
  );
}
