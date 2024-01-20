import loadingImg from '../public/loading.gif'
import loadingDoneImg from '../public/loading_done.gif'

export default function Loading(props) {
  return (
    <div className="p-2 flex justify-center items-center">
      {props.inProgress && (
        <img src={loadingImg.src + '?a=' + Math.random()} width={70} height={70} alt="Done!"/>
      )}
      {props.done && (
        <img src={loadingDoneImg.src + '?a=' + Math.random()} width={70} height={70} alt="Done!"/>
      )}
    </div>
  )
}