export type responseDto = {
  message: string;
  data?: Object | null;
  code: number;
  status?: boolean;
  error?: string | null;
  env?: string | null | undefined;
  count?:number
};

const response = (
  message: string,
  data: Object | null | undefined,
  code: number,
  status: boolean = true,
  error: string = '',
  env: string | null | undefined = process?.env?.ENV,

): Promise<responseDto> => {
  return new Promise((resolve, reject) => {
    let payload: responseDto = {
      message,
      data,
      code,
      status,
      error,
      env,
  
    };
    resolve(payload);
  });
};
export default response;
