export type LambdaOutput = {
  statusCode: number;
  headers: { [key: string]: string };
  body: string;
};

export type LambdaContext = {
  awsRequestId: string;
  getRemainingTimeInMillis: () => number;
};

export type LambdaEvent = {
  resource: string;
  path: string;
  httpMethod: string;
  headers: { [key: string]: string } | null;
  body: string | null;
  pathParameters: { [key: string]: string } | null;
  queryStringParameters: { [key: string]: string } | null;
  requestContext: {
    identity: {
      cognitoIdentityPoolId: null;
      accountId: null;
      cognitoIdentityId: null;
      caller: null;
      sourceIp: string;
      principalOrgId: null;
      accessKey: null;
      cognitoAuthenticationType: null;
      cognitoAuthenticationProvider: null;
      userArn: null;
      userAgent: 'Amazon CloudFront';
      user: null;
    };
    authorizer?: {
      claims: {
        sub: string;
        email_verified: string;
        iss: string;
        'cognito:username': string;
        origin_jti: string;
        aud: string;
        event_id: string;
        token_use: string;
        auth_time: string;
        exp: string;
        iat: string;
        jti: string;
        email: string;
      };
    };
  };
};

export type CognitoEvent = {
  version: string;
  region: string;
  userPoolId: string;
  userName: string;
  callerContext: {
    awsSdkVersion: string;
    clientId: string;
  };
  triggerSource: string;
  request: {
    userAttributes: {
      sub: string;
      email_verified: string;
      'cognito:user_status': string;
      'cognito:email_alias': string;
      email: string;
    };
  };
  response: unknown;
};
