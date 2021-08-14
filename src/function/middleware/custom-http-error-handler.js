const defaults = {
  logger: console.error,
};

const customHttpErrorHandlerMiddleware = (opts = {}) => {
  const options = { ...opts };

  const customHttpErrorHandlerMiddlewareOnError = async (request) => {
    // log the error if options.logger is a function
    if (typeof options.logger === 'function') {
      options.logger(request.error);
    }

    // Set the default expose value to true for statusCode < 500 when
    // an override is not provided
    if (request.error?.statusCode && request.error?.expose === undefined) {
      request.error.expose = request.error.statusCode < 500;
    }

    if (options.fallbackMessage && (!request.error?.statusCode || !request.error?.expose)) {
      request.error = {
        statusCode: 500,
        message: options.fallbackMessage,
        expose: true,
      };
    }

    if (request.error?.expose) {
      request.response = normalizeHttpResponse(request.response);
      request.response.statusCode = request.error?.statusCode;
      request.response.body = request.error?.message;
      request.response.headers['Content-Type'] =
        typeof jsonSafeParse(request.response.body) === 'string' ? 'text/plain' : 'application/json';

      return request.response;
    }
  };

  return {
    onError: customHttpErrorHandlerMiddlewareOnError,
  };
};
