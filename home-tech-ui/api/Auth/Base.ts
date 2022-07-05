import { data } from "autoprefixer";
import axios, {
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosRequestTransformer,
  AxiosResponse,
} from "axios";

export interface ApiResponse<Payload> {
  response?: Payload;
  message: string;
}
export const HomeTechApi = axios.create({
  baseURL: "http://localhost:8080",
  responseType: "json",
  timeout: 60 * 1000,
  timeoutErrorMessage: "timed out",
  transformRequest: [
    (data: any, headers?: AxiosRequestHeaders): any => {
      if (headers) {
        headers["Authorization"] = `Bearer ${localStorage
          .getItem("accessToken")
          ?.toString()}`;
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

export function GetApi(
  path: string,
  config?: AxiosRequestConfig | undefined
): Promise<AxiosResponse<ApiResponse<unknown>>> {
  return HomeTechApi.get(path, config);
}
