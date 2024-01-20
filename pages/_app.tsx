import '../styles/globals.scss'

import { SessionProvider } from "next-auth/react"
import { store } from '/stote'
import { Provider } from 'react-redux'
import ErrorContextProvider from 'components/ErrorContext'

export default function App({
  Component, pageProps: { session, ...pageProps }
}) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <ErrorContextProvider >
          <Component {...pageProps}/>
        </ErrorContextProvider>
      </Provider>
    </SessionProvider>
  )
}
