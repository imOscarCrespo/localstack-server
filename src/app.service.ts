import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  public doSomethingOnEvent(){
    return true
  }
}
