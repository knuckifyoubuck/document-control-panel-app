import { Injectable } from '@angular/core';
import { LoginReqDto } from '@document-control-app/core/interfaces/login-req-dto.interface';
import { LoginResDto } from '@document-control-app/core/interfaces/login-res-dto.interface';
import { HttpService } from '@document-control-app/core/services/http.service';

@Injectable()
export class LoginApiService {
  constructor(private readonly http: HttpService) {}

  login(loginReqDto: LoginReqDto) {
    return this.http.post<LoginReqDto, LoginResDto>('/auth/login', loginReqDto);
  }
}
