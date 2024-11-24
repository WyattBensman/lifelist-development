export const toErrorResult = (error) => {
  const defaultErrorCode = "INTERNAL_SERVER_ERROR";
  const errorCode = error.extensions?.code || defaultErrorCode;

  console.error("Error:", { message: error.message, stack: error.stack });

  return {
    message: error.message || "An unexpected error occurred.",
    extensions: {
      code: errorCode,
      statusCode:
        {
          VALIDATION_ERROR: 400,
          UNAUTHORIZED: 401,
          NOT_FOUND: 404,
          INTERNAL_SERVER_ERROR: 500,
        }[errorCode] || 500,
    },
  };
};
