import { ExtendedSpecConfig, generateSpec } from 'tsoa';
import packageJson from '../backend/package.json';

(async () => {
  const env = process.argv[2];

  const specOptions: ExtendedSpecConfig = {
    entryFile: 'xxx',
    specVersion: 3,
    outputDirectory: './',
    controllerPathGlobs: ['./src/**/*Controller.ts'],
    securityDefinitions: {
      api_token: {
        type: 'apiKey',
        name: 'x-api-token',
        in: 'header',
      },
    },
    noImplicitAdditionalProperties: 'throw-on-extras',
    host: `bunnybill${env === 'prod' ? '' : `-${env}`}.celestialstudio.net`,
    basePath: 'api',
    name: 'Bunny Bill API',
    specFileBaseName: 'index',
    version: packageJson.version,
  };

  await generateSpec(specOptions);
})();
