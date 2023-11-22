const getOrigin = () => {
    const origin = window.location.origin;
    if (origin.indexOf('localhost') !== -1) {
        return 'http://localhost:4566';
    }
    return origin;
}


export const GATEWAY_URL = `${getOrigin()}/restapis/${import.meta.env.VITE_GATEWAY_ID}/prod/_user_request_/`;
export const  MAX_FILE_SIZE = 500000;
export const  FILES_BUCKET = import.meta.env.VITE_FILES_BUCKET;
export const REGION = import.meta.env.VITE_REGION;
export const IDENTITY_POOL_ID = import.meta.env.VITE_IDENTITY_POOL_ID;
export const  BASE_URL =  import.meta.env.BASE_URL;
