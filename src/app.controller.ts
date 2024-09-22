import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    @Inject('ORDER_SERVICE') private client: ClientProxy,
  ) {}

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
      // complete the order
    this.client.emit('order_completed', data);
    } else {
      channel.ack(originalMsg);
      console.log('Order created  but not in stock', data);
      // cancel the order
      this.client.emit('order_cancelled', data);
    }
  }
}
