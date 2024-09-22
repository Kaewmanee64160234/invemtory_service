import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @MessagePattern('order_created')
  async handleOrderCreated(data: any,@Ctx() context: RmqContext) {
   
    // console.log('Order created', data);
    // console.log('context', context);
    // return 'Order created ';
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    console.log('Order created', data);
    const instock = true;
    if (instock) {
      channel.ack(originalMsg);
      console.log('Order created', data);
    } else {
      channel.ack(originalMsg);
      console.log('Order created  but not in stock', data);
    }
  }
}
