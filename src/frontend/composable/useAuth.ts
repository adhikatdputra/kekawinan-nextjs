import { useAtomValue, useSetAtom } from "jotai";
import {
  expiresInAtom,
  isAuthenticatedAtom,
  roleActiveAtom,
  userAtom,
} from "../state/auth";
import { User } from "../interface/user";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { COOKIE_SECURE } from "../../lib/config";

export const useAuth = () => {
  const atomUser = useAtomValue(userAtom);
  const atomExpiresIn = useAtomValue(expiresInAtom);
  const atomIsAuthenticated = useAtomValue(isAuthenticatedAtom);
  const atomRoleActive = useAtomValue(roleActiveAtom);
  const setUser = useSetAtom(userAtom);
  const setExpiresIn = useSetAtom(expiresInAtom);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  const setRole = useSetAtom(roleActiveAtom);
  const expiredCookies = 30;

  const setAuth = (user: User, expiresIn: string) => {
    setUser(user);
    setIsAuthenticated(true);
    setExpiresIn(expiresIn);

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
  };

  const setRoleActive = (role: string) => {
    setRole(role);
    Cookies.set(
      "roleActive",
      CryptoJS.AES.encrypt(role, "roleActive").toString(),
      {
        expires: expiredCookies,
        secure: COOKIE_SECURE,
      }
    );
  };

  const getRoleActive = () => {
    if (typeof window !== "undefined") {
      const roleActive = Cookies.get("roleActive");
      if (roleActive) {
        try {
          const decryptedRole = CryptoJS.AES.decrypt(roleActive, "roleActive");
          const decryptedString =
            decryptedRole.toString(CryptoJS.enc.Utf8) || atomRoleActive;
          return decryptedString;
        } catch (error) {
          console.error("Error decoding role active:", error);
          return null;
        }
      }
    }
    return null;
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

  const getUserPD = () => {
    const user = getUser();
    if (user) {
      return user.skpd;
    }
    return null;
  };

  const getUserUKE = () => {
    const user = getUser();
    if (user) {
      return user.uke;
    }
    return null;
  };

  const getExpiresIn = () => {
    return Cookies.get("expiresIn") || atomExpiresIn;
  };

  const getIsAuthenticated = () => {
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

  const isPimpinan = () => {
    return getRoleActive() === "Pimpinan";
  };

  const isAdminSKPD = () => {
    return getRoleActive() === "Admin SKPD";
  };

  const removeAuth = () => {
    Cookies.remove("userData");
    Cookies.remove("expiresIn");
    Cookies.remove("isAuthenticated");
    Cookies.remove("roleActive");
    setUser(null);
    setExpiresIn(null);
    setIsAuthenticated(false);
    setRoleActive("");
  };

  return {
    user: atomUser,
    setAuth,
    getUser,
    getExpiresIn,
    removeAuth,
    getIsAuthenticated,
    setRoleActive,
    getRoleActive,
    isPimpinan,
    isAdminSKPD,
    getUserPD,
    getUserUKE,
  };
};
