import EditLTGPage from "../../../../components/page/editLTG"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EditLTGPage ltgId={id} />
}