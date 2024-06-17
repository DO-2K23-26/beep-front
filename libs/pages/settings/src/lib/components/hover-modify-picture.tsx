export function HoverModifyPicture() {
  return (
    <button className="relative">
      <img
        className="w-9 min-w-[175px] h-9 min-h-[175px] object-cover"
        src={'/picture.svg'}
        alt={'-img'}
      />
      <div className="w-9 min-w-[175px] h-9 min-h-[175px] absolute inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-[36px]">
        Modify
      </div>
    </button>
  )
}
