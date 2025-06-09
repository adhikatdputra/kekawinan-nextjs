import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

instance.interceptors.request.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (config: any) => {
    let token: string | undefined = "";
    if (Cookies.get("token")) {
      token = Cookies.get("token");
    }

    return {
      ...config,
      headers: {
        ...config.headers,
        // 'Access-Control-Allow-Credentials': 'true',
        "Access-Control-Allow-Origin": "*",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const { response } = error;
    if (
      response &&
      (response.data.message === "Invalid credentials" ||
        response.status === 401)
    ) {
      Cookies.remove("userData");
      Cookies.remove("expiresIn");
      Cookies.remove("isAuthenticated");
      Cookies.remove("roleActive");
      window.location.href =
        (process.env.NEXT_PUBLIC_BASE_PATH || "") + "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
