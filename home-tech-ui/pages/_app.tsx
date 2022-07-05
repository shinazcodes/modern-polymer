import "../styles/globals.css";
import type { AppProps } from "next/app";
import NavBar from "./components/navbar";
import { Provider } from "react-redux";
import { persistor, store } from "../api/store";
import { PersistGate } from "redux-persist/integration/react";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={<>loading</>} persistor={persistor}>
          <NavBar />
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </>
  );
}

export default MyApp;
