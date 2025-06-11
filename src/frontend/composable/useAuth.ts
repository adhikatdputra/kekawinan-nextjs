import { useAtomValue, useSetAtom } from "jotai";
import { expiresInAtom, isAuthenticatedAtom, tokenAtom, userAtom } from "../state/auth";
import { User } from "../interface/user";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { COOKIE_SECURE } from "../../lib/config";

export const useAuth = () => {
  const atomUser = useAtomValue(userAtom);
  const atomExpiresIn = useAtomValue(expiresInAtom);
  const atomIsAuthenticated = useAtomValue(isAuthenticatedAtom);
  const atomToken = useAtomValue(tokenAtom);
  const setUser = useSetAtom(userAtom);
  const setExpiresIn = useSetAtom(expiresInAtom);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  const setToken = useSetAtom(tokenAtom);
  const expiredCookies = 30;

  const setAuth = (user: User, expiresIn: string) => {
    setUser(user);
    setIsAuthenticated(true);
    setExpiresIn(expiresIn);
    setToken(user.token);

    Cookies.set(
      "isAuthenticated",
      CryptoJS.AES.encrypt("true", "isAuthenticated").toString(),
      {
        expires: expiredCookies,
        secure: COOKIE_SECURE,
      }
    );
    Cookies.set(
      "userData",
      CryptoJS.AES.encrypt(JSON.stringify(user), "userData").toString(),
      {
        expires: expiredCookies,
        secure: COOKIE_SECURE,
      }
    );
    Cookies.set("expiresIn", expiresIn, {
      expires: expiredCookies,
      secure: COOKIE_SECURE,
    });
    Cookies.set("token", user.token, {
      expires: expiredCookies,
      secure: COOKIE_SECURE,
    });
    Cookies.set("fullname", user.fullname, {
      expires: expiredCookies,
      secure: COOKIE_SECURE,
    });
  };

  const getUser = () => {
    if (typeof window !== "undefined") {
      const userData = Cookies.get("userData");
      if (userData) {
        const decryptedData = CryptoJS.AES.decrypt(userData, "userData");
        const decryptedString = decryptedData.toString(CryptoJS.enc.Utf8);
        try {
          return JSON.parse(decryptedString);
        } catch (error) {
          console.error("Error decoding user data:", error);
          return null;
        }
      }
    }
    return null;
  };

  const getUserName = () => {
    return Cookies.get("fullname");
  };

  const setUserName = (name: string) => {
    Cookies.set("fullname", name, {
      expires: expiredCookies,
      secure: COOKIE_SECURE,
    });
  };

  const getExpiresIn = () => {
    return Cookies.get("expiresIn") || atomExpiresIn;
  };

  const getToken = () => {
    return Cookies.get("token") || atomToken;
  };

  const isAuthenticated = () => {
    if (typeof window !== "undefined") {
      const isAuthenticated = Cookies.get("isAuthenticated");
      if (isAuthenticated) {
        try {
          const decryptedIsAuthenticated = CryptoJS.AES.decrypt(
            isAuthenticated,
            "isAuthenticated"
          );
          const decryptedString =
            decryptedIsAuthenticated.toString(CryptoJS.enc.Utf8) ||
            atomIsAuthenticated;
          return decryptedString === "true";
        } catch (error) {
          console.error("Error decoding isAuthenticated:", error);
          return false;
        }
      }
    }
    return false;
  };

  const removeAuth = () => {
    Cookies.remove("userData");
    Cookies.remove("expiresIn");
    Cookies.remove("isAuthenticated");
    Cookies.remove("token");
    Cookies.remove("fullname");
    setUser(null);
    setExpiresIn(null);
    setIsAuthenticated(false);
    setToken(null);
  };

  return {
    user: atomUser,
    setAuth,
    getUser,
    getExpiresIn,
    removeAuth,
    isAuthenticated,
    getToken,
    getUserName,
    setUserName,
  };
};
