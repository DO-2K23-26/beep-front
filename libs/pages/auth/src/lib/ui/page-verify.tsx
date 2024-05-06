import { Button, ButtonStyle } from "@beep/ui"
import { useNavigate } from "react-router"

interface PageVerifyProps {
    stateVerification: boolean
    loading: boolean
    onClickButton: () => void
}

export const PageVerify: React.FC<PageVerifyProps> = ({ stateVerification, loading, onClickButton }) => {
    
    
    return (
        <div
            className="h-[100dvh] w-full bg-no-repeat bg-cover flex justify-center"
            style={{ backgroundImage: `url('/background.svg')` }}
        >
            <div className="flex flex-col gap-6 justify-center items-start">
                <h1 className="font-extrabold">Account verification</h1>
                <div className="underline">
                    {
                        loading ? (
                            <p>Loading...</p>
                        ) : (
                            <>
                                {
                                    stateVerification ? (
                                        <h3>Your account has been verified</h3>
                                    ) : (
                                        <h3>Invalid token</h3>
                                    )
                                }
                                <div className="mt-6 text-center">
                                    <Button style={ButtonStyle.STROKED} onClick={() => onClickButton()}>Time to signin !</Button>
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    )
}