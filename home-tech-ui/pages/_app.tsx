import "../styles/globals.css";
import type { AppProps } from "next/app";
import NavBar from "./components/navbar";
import { Provider } from "react-redux";
import { persistor, store } from "../api/store";
import { PersistGate } from "redux-persist/integration/react";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useEffect } from "react";
import { useRouter } from "next/router";
import AuthGuard from "../util/AuthGuard";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {});
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={<>loading</>} persistor={persistor}>
          {!router.pathname.includes("external") && <NavBar />}
          <AuthGuard>
            <Component {...pageProps} />
          </AuthGuard>
        </PersistGate>
      </Provider>
    </>
  );
}

export default MyApp;
