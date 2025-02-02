// Dependencies
import { useState } from 'react'
import { useTranslation } from 'next-i18next'
// Hooks
import { useAccount } from 'shared/hooks/use-account.mjs'
import { useBackend } from 'shared/hooks/use-backend.mjs'
import { useLoadingStatus } from 'shared/hooks/use-loading-status.mjs'
// Components
import { Icons, welcomeSteps, BackToAccountButton } from './shared.mjs'
import { OkIcon, NoIcon } from 'shared/components/icons.mjs'
import { ContinueButton } from 'shared/components/buttons/continue-button.mjs'

export const ns = ['account', 'toast']

export const UsernameSettings = ({ title = false, welcome = false }) => {
  // Hooks
  const { account, setAccount } = useAccount()
  const backend = useBackend()
  const { setLoadingStatus, LoadingStatus } = useLoadingStatus()
  const { t } = useTranslation(ns)
  const [username, setUsername] = useState(account.username)
  const [available, setAvailable] = useState(true)

  const update = async (evt) => {
    evt.preventDefault()
    if (evt.target.value !== username) {
      setUsername(evt.target.value)
      const result = await backend.isUsernameAvailable(evt.target.value)
      if (result?.response?.response?.status === 404) setAvailable(true)
      else setAvailable(false)
    }
  }

  const save = async () => {
    setLoadingStatus([true, 'processingUpdate'])
    const result = await backend.updateAccount({ username })
    if (result.success) {
      setAccount(result.data.account)
      setLoadingStatus([true, 'settingsSaved', true, true])
    } else setLoadingStatus([true, 'backendError', true, true])
  }

  const nextHref =
    welcomeSteps[account.control].length > 4
      ? '/welcome/' + welcomeSteps[account.control][5]
      : '/docs/guide'

  let btnClasses = 'btn mt-4 capitalize '
  if (welcome) btnClasses += 'w-64 btn-secondary'
  else btnClasses += 'w-full btn-primary'

  return (
    <div className="max-w-xl">
      <LoadingStatus />
      {title ? <h1 className="text-4xl">{t('usernameTitle')}</h1> : null}
      <div className="flex flex-row items-center">
        <input
          value={username}
          onChange={update}
          className="input w-full input-bordered flex flex-row"
          type="text"
          placeholder={t('title')}
        />
        <span className={`-ml-10 rounded-full p-1 ${available ? 'bg-success' : 'bg-error'}`}>
          {available ? (
            <OkIcon className="w-5 h-5 text-neutral-content" stroke={4} />
          ) : (
            <NoIcon className="w-5 h-5 text-neutral-content" stroke={3} />
          )}
        </span>
      </div>
      <button className={btnClasses} disabled={!available} onClick={save}>
        <span className="flex flex-row items-center gap-2">
          {available ? t('save') : t('usernameNotAvailable')}
        </span>
      </button>

      {welcome ? (
        <>
          <ContinueButton btnProps={{ href: nextHref }} link />
          {welcomeSteps[account.control].length > 0 ? (
            <>
              <progress
                className="progress progress-primary w-full mt-12"
                value={500 / welcomeSteps[account.control].length}
                max="100"
              ></progress>
              <span className="pt-4 text-sm font-bold opacity-50">
                5 / {welcomeSteps[account.control].length}
              </span>
              <Icons
                done={welcomeSteps[account.control].slice(0, 4)}
                todo={welcomeSteps[account.control].slice(5)}
                current="username"
              />
            </>
          ) : null}
        </>
      ) : (
        <BackToAccountButton />
      )}
    </div>
  )
}
