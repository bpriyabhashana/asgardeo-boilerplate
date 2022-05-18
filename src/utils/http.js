import { useReducer, useCallback } from 'react';
import { getIdToken, refreshToken, getToken } from './oauth';

const httpReducer = (curHttpState, action) => {
    switch (action.type) {
        case 'SEND':
            return { loading: true, error: null, data: null, extra: action.extra, open: true }
        case 'RESPONSE':
            return { ...curHttpState, loading: false, data: action.responseData, extra: action.extra, open: false }
        case 'NO RESPONSE':
            return { loading: false, extra: action.extra, open: false }
        case 'ERROR':
            return { loading: false, extra: action.extra, error: action.errorMessage }
        case 'CLEAR':
            return { ...curHttpState, error: null }
        default:
            throw new Error('Should not get here');
    }
}

const useHttp = () => {
    const [httpState, dispatchHTTP] = useReducer(httpReducer,
        { loading: false, error: null, data: null, extra: null, open: false });

    const sendRequest =
        useCallback((url, method, body, reqExtra, isRetry) => {
            var encodedUrl = encodeURI(url);
            dispatchHTTP({ type: 'SEND', extra: reqExtra });
            fetch(encodedUrl, {
                method: method,
                body: (body ? body : null),
                headers: {
                    'Content-Type': 'application/json',
                    'apiKey': getIdToken(),
                    'Authorization': "Bearer "+getToken(),
                },
            })
                .then((response) => {
                    if ((response.status === 200 || response.status === 201) && response.body) {
                        return response.json();
                    }
                    else if (response.status >= 400) {
                        if (isRetry) {
                            dispatchHTTP({ type: 'ERROR', extra: reqExtra, errorMessage: 'Try reloading the page. If the issue continues, please contact internal-apps-group@wso2.com.' });
                            return;
                        }
                        if(response.status === 401){
                            refreshToken(()=>sendRequest(encodedUrl, method, body, reqExtra, true));
                        } else {
                            response.json().then((errorResponse)=>{
                                dispatchHTTP({ type: 'ERROR', extra: reqExtra, errorMessage: errorResponse });
                            }).catch(err=>{
                                dispatchHTTP({ type: 'ERROR', extra: reqExtra, errorMessage: err });
                            });
                            
                            return;
                        }
                    }
                    else {
                        dispatchHTTP({ type: 'NO RESPONSE', extra: reqExtra });
                        return;
                    }

                })
                .then((response) => {
                    if (response) {
                        dispatchHTTP({ type: 'RESPONSE', responseData: response, extra: reqExtra });
                        return;
                    }
                })
                .catch((er) => {
                    dispatchHTTP({ type: 'ERROR', extra: reqExtra, errorMessage: er });
                    console.error("Error", er);
                })

        }, []);

    const sendRequestForImage =
        useCallback((url, method, body, reqExtra, isRetry) => {
            dispatchHTTP({ type: 'SEND', extra: reqExtra });
            fetch(url, {
                method: method,
                body: (body ? body : null),
                headers: {
                    'Content-Type': 'application/json',
                    'apiKey': getIdToken(),
                    'Authorization': 'Bearer ' + getToken(),
                },
            }).then((response) => {
                
                if (response.status === 200 && response.body) {
                    return response.body;
                } else {
                    dispatchHTTP({ type: 'NO RESPONSE', extra: reqExtra });
                    return;
                }

            }).then(response => {
                const reader = response.getReader();

                return new ReadableStream({
                    start(controller) {
                        return pump();
                        function pump() {
                            return reader.read().then(({ done, value }) => {
                                if (done) {
                                    controller.close();
                                    return;
                                }
                                controller.enqueue(value);
                                return pump();
                            });
                        }
                    }
                })
            })
                .then(stream => new Response(stream))
                .then(response => response.blob())
                .then(blob => {
                    let url = URL.createObjectURL(blob)
                    dispatchHTTP({ type: 'RESPONSE', responseData: url, extra: reqExtra });
                })
                .catch(err => {
                    dispatchHTTP({ type: 'ERROR', extra: reqExtra,});
                    return;
                });
        }, []);

    const clearError = () => {
        dispatchHTTP({ type: 'CLEAR' });
    };
    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        sendRequest,
        sendRequestForImage,
        // sendRequestWithJWT: sendRequestWithJWT,
        // sendEmail: sendEmail,
        clearError: clearError,
        reqExtra: httpState.extra,
        isOpen: httpState.open
    };
};

export default useHttp;