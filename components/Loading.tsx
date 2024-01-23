import loadingImg from '../public/loading.gif'
import loadingDoneImg from '../public/loading_done.gif'

type LoadingProps = {
  inProgress?: boolean,
  done?: boolean
}

export default function Loading(props: LoadingProps) {
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