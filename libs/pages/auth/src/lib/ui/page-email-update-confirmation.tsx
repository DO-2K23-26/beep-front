export interface PageEmailUpdateConfirmation {
  state: 'pending' | 'error' | 'success'
  onErrorClick: () => void
}

export function PageEmailUpdateConfirmation({
  state,
  onErrorClick,
}: PageEmailUpdateConfirmation) {
  let title = ''
  let subtitle = ''

  switch (state) {
    case 'pending':
      title = 'Waiting for confirmation...'
      break
    case 'success':
      title = 'Waiting for confirmation...'
      subtitle = 'You will be redirect to the signin page.'
      break
    default:
      title = 'Oups something went wrong'
      subtitle =
        'Either the token is expired or you are not allowed to do that.'
      break
  }

  return (
    <div className="flex flex-col gap-6 justify-center items-start">
      <h1 className="font-extrabold">{title}</h1>
      <div className="flex flex-row gap-2 items-center">
        <h5>{subtitle}</h5>
        {state === 'error' ? (
          <button
            className="hover:underline text-violet-900"
            onClick={onErrorClick}
          >
            Go to signin
          </button>
        ) : null}
      </div>
    </div>
  )
}
