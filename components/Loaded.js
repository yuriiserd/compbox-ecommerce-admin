import Image from "next/image"
import loadedImg from '../public/loaded.gif'

export default function Loaded() {
  console.log(loadedImg)
  return (
    <div className="p-2 flex justify-center items-center">
      <img src={loadedImg.src + '?a=' + Math.random()} width={70} height={70} alt="Done!"/>
    </div>
  )
}