// Dependencies
import { useTranslation } from 'next-i18next'
// Hooks
import { useState } from 'react'
import { useBackend } from 'shared/hooks/use-backend.mjs'
import { useLoadingStatus } from 'shared/hooks/use-loading-status.mjs'
// Components
import { BackToAccountButton } from './shared.mjs'
import { Popout } from 'shared/components/popout/index.mjs'
import { WebLink } from 'shared/components/web-link.mjs'

export const ns = ['account', 'status']

export const ExportAccount = () => {
  // Hooks
  const backend = useBackend()
  const { t } = useTranslation(ns)
  const { setLoadingStatus, LoadingStatus } = useLoadingStatus()

  const [link, setLink] = useState()

  // Helper method to export account
  const exportData = async () => {
    setLoadingStatus([true, 'processingUpdate'])
    const result = await backend.exportAccount()
    if (result.success) {
      setLink(result.data.data)
      setLoadingStatus([true, 'nailedIt', true, true])
    } else setLoadingStatus([true, 'backendError', true, false])
  }

  return (
    <div className="max-w-xl">
      <LoadingStatus />
      {link ? (
        <Popout link>
          <h5>{t('exportDownload')}</h5>
          <p className="text-lg">
            <WebLink href={link} txt={link} />
          </p>
        </Popout>
      ) : null}
      <p>{t('exportMsg')}</p>
      <button className="btn btn-primary capitalize w-full my-2" onClick={exportData}>
        {t('export')}
      </button>
      <BackToAccountButton />
    </div>
  )
}
