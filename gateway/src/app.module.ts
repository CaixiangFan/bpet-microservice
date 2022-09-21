import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ADMIN_SERVICE',
        transport: Transport.TCP,
        options: { port: 3001 }
      },
      {
        name: 'REGISTRY_SERVICE',
        transport: Transport.TCP,
        options: { port: 3002}
      },
      // {
      //   name: 'BID_SERVICE',
      //   transport: Transport.TCP,
      //   options: { port: 3003}
      // },
      // {
      //   name: 'OFFER_SERVICE',
      //   transport: Transport.TCP,
      //   options: { port: 3004}
      // },
      {
        name: 'POOLMARKET_SERVICE',
        transport: Transport.TCP,
        options: { port: 3005}
      }
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
