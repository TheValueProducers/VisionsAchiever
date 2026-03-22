import EditMTGPage from "../../../../components/page/editMTG"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EditMTGPage mtgId={id} />
}
