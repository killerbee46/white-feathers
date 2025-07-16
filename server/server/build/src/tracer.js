// // const opentelemetry = require("@opentelemetry/sdk-node");
// import opentelemetry from '@opentelemetry/sdk-node';
// import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
// import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
// import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
// import { Resource } from '@opentelemetry/resources';
// import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
// export const init = (serviceName: string, environment: string) => {
//   const exporterOptions = {
//     url: 'http://localhost:4318/v1/traces'
//   };
//   const traceExporter = new OTLPTraceExporter(exporterOptions);
//   const sdk = new opentelemetry.NodeSDK({
//     traceExporter,
//     instrumentations: [
//       getNodeAutoInstrumentations(),
//       new GraphQLInstrumentation({
//         allowValues: true
//       })
//     ],
//     resource: new Resource({
//       [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
//       [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment
//     })
//   });
//   sdk.start();
// };
