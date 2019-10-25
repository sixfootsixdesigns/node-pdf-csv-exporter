export interface ResponseBody {
  message: string;
  data: any;
}

export function buildResponseBody(data, statusMessage = 'OK'): ResponseBody {
  return {
    message: statusMessage,
    data,
  };
}
