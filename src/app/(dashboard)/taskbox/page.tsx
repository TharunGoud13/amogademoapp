
import { Metadata } from "next";
import fs from "fs";
import path from "path";
import { DataTable } from "@/components/data-table-components/data-table";
import { columns } from "@/components/data-table-components/columns";
export const metadata: Metadata = {
  title: "Expenses",
  description: "A Expense tracker build using Tanstack Table."
};

async function getData() {
  const filePath = path.join(
    process.cwd(),
    "src/components/data-table-components",
    "data.json"
  );
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

export default async function Page() {
  const data = await getData();

  return (
    <div className="h-full flex-1 flex-col space-y-2 p-8 md:flex">
      <DataTable data={data} loading={false} columns={columns} />
    </div>
  );
}
