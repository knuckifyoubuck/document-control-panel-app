import { Injectable } from '@angular/core';
import { UserResDto } from '../interfaces/user-res-dto.interface';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  setAuthToken(token: string) {
    window.localStorage.setItem('userToken', token);
  }

  getAuthToken(): string | null {
    return window.localStorage.getItem('userToken');
  }

  deleteAuthToken() {
    window.localStorage.removeItem('userToken');
  }

  setUserData(user: Pick<UserResDto, 'fullName' | 'role'>) {
    window.localStorage.setItem(
      'userData',
      JSON.stringify({ fullName: user.fullName, role: user.role })
    );
  }

  getUserData(): Pick<UserResDto, 'fullName' | 'role'> | null {
    if (window.localStorage.getItem('userData')) {
      return JSON.parse(window.localStorage.getItem('userData')!);
    } else {
      return null;
    }
  }

  deleteUserData() {
    window.localStorage.removeItem('userData');
  }
}
