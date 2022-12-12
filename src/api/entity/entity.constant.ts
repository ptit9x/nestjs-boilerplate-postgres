import { swaggerSchemaExample } from 'src/share/utils/swagger_schema';

export const ENTITY_CONST = {
  MODEL_NAME: 'entity',
  MODEL_PROVIDER: 'ENTITY_MODEL',
};

export const SWAGGER_RESPONSE = {
  HEALTH_CHECK: swaggerSchemaExample(
    {
      data: {
        message: 'OK Test',
      },
      statusCode: 200,
    },
    'API for health check',
  ),
};
