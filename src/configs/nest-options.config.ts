import { NestApplicationOptions } from '@nestjs/common';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import * as WinstonCloudWatch from 'winston-cloudwatch';

type ClouWatchConfigInterface = {
  logGroup: string;
  logStream: string;
  accessKey: string;
  secretKey: string;
  region: string;
};

const getCloudwatchConfig = (): ClouWatchConfigInterface => {
  const dateFomarted = new Date().toJSON().substring(0, 10); // YYYY-MM-DD
  let logStream = process.env.CLOUD_WATCH_LOG_STREAM || 'be';
  logStream += ['develop', 'test', 'staging'].includes(process.env.NODE_ENV)
    ? `-${process.env.NODE_ENV}`
    : '';
  logStream += `-${dateFomarted}`;

  return {
    logGroup: process.env.CLOUD_WATCH_LOG_GROUP || 'ptr-logs',
    logStream,
    accessKey: process.env.CLOUD_WATCH_AWS_ACCESS_KEY_ID,
    secretKey: process.env.CLOUD_WATCH_AWS_SECRET_ACCESS_KEY,
    region: process.env.CLOUD_WATCH_AWS_REGION || 'ap-east-1',
  };
};

export const cloudwatchConfig: ClouWatchConfigInterface = getCloudwatchConfig();

export default {
  logger: WinstonModule.createLogger({
    format: winston.format.uncolorize(),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike(),
        ),
      }),
      new WinstonCloudWatch({
        name: 'CloudwatchLogs',
        logGroupName: cloudwatchConfig.logGroup,
        logStreamName: cloudwatchConfig.logStream,
        awsOptions: {
          credentials: {
            accessKeyId: cloudwatchConfig.accessKey,
            secretAccessKey: cloudwatchConfig.secretKey,
          },
          region: cloudwatchConfig.region,
        },
      }),
    ],
  }),
} as NestApplicationOptions;
