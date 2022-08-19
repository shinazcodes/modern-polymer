import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "../styles/Home.module.css";
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAM8Rhth68RbquY8yGR1TY2jxVEDkdkvKw",
  authDomain: "home-tech-70316.firebaseapp.com",
  databaseURL:
    "https://home-tech-70316-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "home-tech-70316",
  storageBucket: "home-tech-70316.appspot.com",
  messagingSenderId: "377165191125",
  appId: "1:377165191125:web:9054e23d5e69bac8c1cf5c",
  measurementId: "G-5C67MZR8E6",
};

const Home: NextPage = () => {
  // Initialize Firebase
  // const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);
  const router = useRouter();

  useEffect(() => {
    console.log(router.asPath);
    if (router.asPath === "/") {
      router.replace("/auth/login");
    } else {
      router.replace(router.asPath);
    }
  });
  return <div className={styles.container}></div>;
};

export default Home;
