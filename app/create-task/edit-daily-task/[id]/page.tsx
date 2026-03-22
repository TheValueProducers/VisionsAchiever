import EditDailyTaskPage from "../../../../components/page/editDailyTask"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EditDailyTaskPage taskId={id} />
}
