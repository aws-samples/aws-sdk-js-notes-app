export function checkParms(
  params: { valToChk: any; name: string }[]
): string[] {
  let errors: string[] = [];
  params.forEach((parm) => {
    if (parm.valToChk == undefined) {
      errors.push(`${parm.name} Missing`);
    } else {
      console.log(parm.name, parm.valToChk);
    }
  });
  return errors;
}

export function errorResponse(errorMessage: string, awsRequestId: string) {
  return {
    statusCode: 500,
    body: JSON.stringify({
      Error: errorMessage,
      Reference: awsRequestId,
    }),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
}

export function toUrlString(buffer: any) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}
