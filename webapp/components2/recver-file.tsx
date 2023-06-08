import FileItem from "./file-item"
import { Manifest } from "../lib/manifest"
import { ExpiresAtHumanTime } from "../lib/util"

export default (props: { file: Manifest }) => {
  const file = props.file
  return (
    <>
      <ul className="p-3 w-full flex flex-row justify-center">
        <li className="m-2 p-4 border-1 border-green-300 rounded-md bg-green-100 shadow-md w-full">
          <div className="flex flex-row justify-between">
            <FileItem file={file}></FileItem>
          </div>
          { file.files?.length > 1
            ? <details className="cursor-pointer">
                <summary>{ file.files.length.toString() + " files" }</summary>
            { file.files.map((file, index) =>
              <div key={index} className="mx-8">
                <FileItem file={file}></FileItem>
              </div>)
            } </details>
            : null
          }
          <div>
            Expires after { file.remain } download or { ExpiresAtHumanTime(file.expire) }
          </div>
        </li>
      </ul>

      <button className="p-3 w-full block border-1 rounded-md bg-blue-500 text-white font-bold">Download</button>
    </>
  )
}
