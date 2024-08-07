import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"
import Image from "next/image"
import { z } from "zod"

// import { columns } from "./components/columns"
import { columns } from "@/components/task-tables/task-columns"
// import { taskColumns } from "@/components/task-tables/task-columns"
// import { UserNav } from "./components/user-nav"
// import { taskSchema } from "./data/schema"
import { taskSchema } from "@/constants/schema"
import { TaskTable } from "@/components/task-tables/task-table"

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
}

// Simulate a database read for tasks.
// using filesystem we read the data to a variable by giving it a file path
async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "src/constants/tasks.json"),
  )

  const tasks = JSON.parse(data.toString())

  return z.array(taskSchema).parse(tasks)
}

export default async function TaskPage() {
  const tasks = await getTasks()

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 pt-[1%] md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {/* <UserNav /> */}
          </div>
        </div>
        <TaskTable data={tasks} columns={columns} />
      </div>
    </>
  )
}
