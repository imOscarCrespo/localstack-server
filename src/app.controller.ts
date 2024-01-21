import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

import {
  ConfirmSubscriptionCommand,
  ConfirmSubscriptionCommandOutput,
  SNSClient,
} from '@aws-sdk/client-sns';


@Controller()
export class AppController {
  private readonly snsClient: SNSClient;

  constructor(private readonly appService: AppService) {
    this.snsClient = new SNSClient({
      endpoint: process.env.SNS_ENDPOINT || 'http://127.0.0.1:4566',
      region: process.env.AWS_REGION || 'eu-west-1',
    });
  }

  @Post('_sns/onEvent')
  onEvent(@Body() message: string, @Req() req: Request): Promise<ConfirmSubscriptionCommandOutput> | boolean {
    if (req.headers['x-amz-sns-message-type'] === 'SubscriptionConfirmation') {
      const subscribeEvent: { Token: string; TopicArn: string } =
        JSON.parse(message);
      const { Token: token, TopicArn: topicArn } = subscribeEvent;
      const command = new ConfirmSubscriptionCommand({
        Token: token,
        TopicArn: topicArn,
      });

      return this.snsClient.send(command)
    } else {
      console.log('Hello I have recieved the event')
      return this.appService.doSomethingOnEvent()
    }
  }
}
