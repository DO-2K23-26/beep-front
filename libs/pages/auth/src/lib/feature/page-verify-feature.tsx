import { useNavigate, useParams } from "react-router"
import { PageVerify } from "../ui/page-verify"
import { useVerifyEmailMutation } from "@beep/user"
import { useEffect, useState } from "react"

export const PageVerifyFeature: React.FC = () => {
    const navigate = useNavigate()

    const { token = '' } = useParams<{ token: string }>()

    const [ verifyEmail, result ] = useVerifyEmailMutation()
    const [stateVerification, setStateVerification] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (token !== '') {
            setLoading(true)
            verifyEmail({ token: token })
        }
    }, [])

    useEffect(() => {
        setStateVerification(result.isSuccess)
        setLoading(false)
    }, [result])

    const onClickButton = () => {
        sessionStorage.removeItem('accessToken')
        sessionStorage.removeItem('refreshToken')
        navigate('/authentication/signin')
    }

    return (
        <PageVerify stateVerification={stateVerification} loading={loading} onClickButton={onClickButton} />
    )
}