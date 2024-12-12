const { loadEnv, defineConfig } = require('@medusajs/framework/utils');

loadEnv(process.env.NODE_ENV, process.cwd());

module.exports = defineConfig({
 //@ts-ignore
 workerMode: process.env.MEDUSA_WORKER_MODE,
  admin: {
    backendUrl:
      process.env.BACKEND_URL ?? 'https://sofa-society-starter.medusajs.app',
    storefrontUrl: process.env.STOREFRONT_URL,
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS,
      adminCors: process.env.ADMIN_CORS,
      authCors: process.env.AUTH_CORS,
      jwtSecret: process.env.JWT_SECRET || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
    },
  },

  modules: [
    {
       resolve: './src/modules/fashion',
     },
 
   {
     resolve: "@medusajs/medusa/fulfillment",
     options: {
       providers: [
         {
           resolve: `@medusajs/medusa/fulfillment-manual`,
           id: "manual",
           options: {
             // provider options...
           },
         },]
       } ,
     },
   {
     resolve: "@medusajs/medusa/cache-redis",
     options: {
       redisUrl: process.env.REDIS_URL,
     },
   },
   {
     resolve: "@medusajs/medusa/event-bus-redis",
     options: {
       redisUrl: process.env.REDIS_URL,
     },
   },
   {
     resolve: "@medusajs/medusa/workflow-engine-redis",
     options: {
       redis: {
         url: process.env.REDIS_URL,
       },
     },
   },

   {
     resolve: '@medusajs/medusa/payment',
     options: {
       providers: [
        {
           resolve: "@sgftech/payment-razorpay",
           id: "razorpay",
           options: {
             key_id:
                 process?.env?.RAZORPAY_TEST_KEY_ID ??
                 process?.env?.RAZORPAY_ID,
             key_secret:
                 process?.env?.RAZORPAY_TEST_KEY_SECRET ??
                 process?.env?.RAZORPAY_SECRET,
             razorpay_account:
                 process?.env?.RAZORPAY_TEST_ACCOUNT ??
                 process?.env?.RAZORPAY_ACCOUNT,
              automatic_expiry_period: 30 /* any value between 12minuts and 30 days expressed in minutes*/,
              manual_expiry_period: 20,
              refund_speed: "normal",
              webhook_secret:
                 process?.env?.RAZORPAY_TEST_WEBHOOK_SECRET ??
                 process?.env?.RAZORPAY_WEBHOOK_SECRET
         }
         },
       ],
     },
    
   },

   {
     resolve: './src/modules/fashion',
   },
   {
     resolve: '@medusajs/medusa/file',
     options: {
       providers: [
         {
           resolve: '@medusajs/medusa/file-s3',
           id: 's3',
           options: {
             file_url: process.env.S3_FILE_URL,
             access_key_id: process.env.S3_ACCESS_KEY_ID,
             secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
             region: process.env.S3_REGION,
             bucket: process.env.S3_BUCKET,
             endpoint: process.env.S3_ENDPOINT,
             additional_client_config: {
               forcePathStyle:
                 process.env.S3_FORCE_PATH_STYLE === 'true' ? true : undefined,
             },
           },
         },
       ],
     },
   },
 ],


});
