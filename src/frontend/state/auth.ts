import { atom } from "jotai";
import { User } from "../interface/user";

export const userAtom = atom<User | null>(null);
export const expiresInAtom = atom<string | null>(null);
export const isAuthenticatedAtom = atom<boolean | null>(null);
export const tokenAtom = atom<string | null>(null);
