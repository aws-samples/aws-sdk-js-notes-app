export declare function checkParms(
  params: {
    valToChk: any;
    name: string;
  }[]
): string[];
export declare function errorResponse(
  errorMessage: string,
  awsRequestId: string
): {
  statusCode: number;
  body: string;
  headers: {
    "Access-Control-Allow-Origin": string;
  };
};
export declare function toUrlString(buffer: any): any;
