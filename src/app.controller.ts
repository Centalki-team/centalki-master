import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller('app')
@ApiTags('App')
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('')
  hello() {
    return this.appService.sayHello();
  }
}
