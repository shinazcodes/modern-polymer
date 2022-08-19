import { data } from "autoprefixer";
import axios, {
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosRequestTransformer,
  AxiosResponse,
  AxiosResponseHeaders,
  AxiosResponseTransformer,
} from "axios";

export interface ApiResponse<Payload> {
  response?: Payload;
  message: string;
}
export const HomeTechApi = axios.create({
  baseURL: "https://hometechworld.co.in",
  responseType: "json",
  timeout: 60 * 1000,
  timeoutErrorMessage: "timed out",
  transformRequest: [
    (data: any, headers?: AxiosRequestHeaders): any => {
      console.log(headers);
      if (headers) {
        headers["Authorization"] = `Bearer ${localStorage
          .getItem("accessToken")
          ?.toString()}`;
      }
      return data;
    },
    ...(axios.defaults.transformRequest as AxiosRequestTransformer[]),
  ],
  transformResponse: [
    (data: any, headers?: AxiosResponseHeaders): any => {
      if (typeof data === "string") {
        const r = JSON.parse(data);
        if (r.response === "error") {
          throw Error(r.message);
        }
      }
      return JSON.parse(data);
    },
  ],
  ...(axios.defaults.transformResponse as AxiosResponseTransformer[]),
});

export const SmsBuddyApi = axios.create({
  baseURL: "https://thesmsbuddy.com/api/v1",
  responseType: "json",
  timeout: 60 * 1000,
  timeoutErrorMessage: "timed out",
  transformRequest: [
    (data: any, headers?: AxiosRequestHeaders): any => {
      console.log(headers);
      if (headers) {
        headers["Sec-Fetch-Mode"] = "no-cors";
      }
      return data;
    },
    ...(axios.defaults.transformRequest as AxiosRequestTransformer[]),
  ],
});

export enum HomeTechBase {
  api = "/api/",
}

export function buildPath(
  path: string,
  base: HomeTechBase = HomeTechBase.api,
  params: Record<string, string> = {}
): string {
  const paramString = new URLSearchParams(params).toString();
  return base + path + (paramString.length > 0 ? `?${paramString}` : "");
}

export function PostApi(
  path: string,
  data?: any,
  config?: AxiosRequestConfig | undefined
): Promise<AxiosResponse<ApiResponse<unknown>>> {
  return HomeTechApi.post(path, data, config);
}

export function PostSmsApi(
  path: string,
  data?: any,
  config?: AxiosRequestConfig | undefined
): Promise<AxiosResponse<ApiResponse<unknown>>> {
  return SmsBuddyApi.post(path, data, config);
}

export function GetSmsApi(
  path: string,
  config?: AxiosRequestConfig | undefined
): Promise<AxiosResponse<ApiResponse<unknown>>> {
  return SmsBuddyApi.get(path, config);
}

export function GetApi(
  path: string,
  config?: AxiosRequestConfig | undefined
): Promise<AxiosResponse<ApiResponse<unknown>>> {
  return HomeTechApi.get(path, config);
}
