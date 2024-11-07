export default function PageQRCodeVerify() {
  return (
    <div
      style={{ backgroundImage: `url('/background.svg')` }}
      className="h-screen w-full bg-no-repeat bg-cover flex justify-center"
    >
      <div className="flex flex-col gap-6 justify-center items-start">
        <h1 className="font-extrabold">Successfully verified</h1>
        <div className="flex flex-row gap-2 items-center">
          <h5>Go back on your main page, you should be authenticated.</h5>
        </div>
      </div>
    </div>
  )
}
