import { ZodError } from 'zod';

function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    const zodErrors = err.errors.map(error => ({
      path: error.path.join('.'),
      message: error.message,
    }));

    return res.status(400).json({
      error: true,
      code: 400,
      message: err.message ||  "Erro de validação dos dados",
      errors: zodErrors,
    });
  }

  const statusCode = err.code || 500;

  res.status(statusCode).json({
    error: true,
    code: statusCode,
    message: err.message || "Ocorreu um erro interno no servidor.",
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

export default errorHandler;