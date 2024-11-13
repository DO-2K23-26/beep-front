import { Link } from "react-router-dom";

export default function PageQRCodeVerify({ error }: { error: boolean }) {
  if (error) {
    return (
      <div
        style={{ backgroundImage: `url('/background.svg')` }}
        className="h-screen w-full bg-no-repeat bg-cover flex justify-center"
      >
        <div className="flex flex-col gap-6 justify-center items-start m-5">
          <h1 className="font-extrabold">Error validating QRCode</h1>
          <div className="flex flex-row gap-2 items-center">
            <h5>This QRCode has expired</h5>
          </div>
          <Link to="/" className="text-black underline">
            Go to Homepage
          </Link>
        </div>
      </div>
    )
  }
  return (
    <div
      style={{ backgroundImage: `url('/background.svg')` }}
      className="h-screen w-full bg-no-repeat bg-cover flex justify-center"
    >
      <div className="flex flex-col gap-6 justify-center items-start m-5">
        <h1 className="font-extrabold">Successfully verified</h1>
        <div className="flex flex-row gap-2 items-center">
          <h5>Go back on your main page, you should be authenticated.</h5>
        </div>
        <Link to="/" className="text-black underline">
          Go to Homepage
        </Link>
      </div>
    </div>
  )
}
