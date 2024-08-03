import { AxiosError } from 'axios';
import { ref } from 'vue';
import type { Ref } from 'vue';

export interface RequestError {
  code: number | null;
  message: string;
}

export interface RequestPayload<DATA_RESPONSE, REQUEST_PARAMS extends unknown[]> {
  requestCb: (...arg: REQUEST_PARAMS) => Promise<DATA_RESPONSE>;
  onError?: (error: RequestError) => void;
  isClearDataOnNewRequest?: boolean;
  isClearDataOnError?: boolean;
}

export const useRequest = <DATA_RESPONSE, REQUEST_PARAMS extends unknown[]>({
  requestCb: request,
  isClearDataOnNewRequest = false,
  isClearDataOnError = true,
  onError
}: RequestPayload<DATA_RESPONSE, REQUEST_PARAMS>) => {
  const data = ref(null) as Ref<DATA_RESPONSE | null>;
  const isLoading = ref<boolean>(false);
  const error = ref<RequestError | null>(null);

  const run = async (...args: Parameters<typeof request>): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = null;
      if (isClearDataOnNewRequest) {
        data.value = null;
      }

      const currentResponse = await request(...args);

      if (currentResponse !== undefined && currentResponse !== null) {
        data.value = currentResponse;
      }
    } catch (e) {
      if (isClearDataOnError) {
        data.value = null;
      }

      let currentError: RequestError | null = null;

      if (e instanceof AxiosError) {
        currentError = { code: e.response?.status ?? null, message: e.message };
      } else if (e instanceof Error) {
        currentError = { code: null, message: e.message };
      } else {
        currentError = { code: null, message: 'unknown error' };
      }

      if (onError !== undefined) {
        onError(currentError);
      } else {
        error.value = currentError;
      }
    } finally {
      isLoading.value = false;
    }
  };

  return {
    data,
    isLoading,
    error,
    run
  };
};
