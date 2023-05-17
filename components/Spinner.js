import Image from "next/image"
import loadMoreImg from '@/public/Loading_icon.gif'

export default function Spinner() {
  return (
    <div className="h-24 p-2 flex justify-center items-center">
      <Image src={loadMoreImg} width={50} height={50} alt="Loading..."/>
    </div>
  )
}