import { Injectable, signal, WritableSignal } from '@angular/core';
import { UserRole } from '@document-control-app/core/enums/user-role.enum';
import { HttpService } from '@document-control-app/core/services/http.service';
import { UserResDto } from '@document-control-app/core/interfaces/user-res-dto.interface';
import { tap } from 'rxjs';
import { LocalStorageService } from '@document-control-app/core/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  isReviewer: WritableSignal<boolean> = signal(false);
  userData: WritableSignal<Pick<UserResDto, 'fullName' | 'role'> | null> = signal(null);

  constructor(
    private http: HttpService,
    private localStorageService: LocalStorageService
  ) {
    if (this.localStorageService.getUserData()) {
      this.isReviewer.set(this.localStorageService.getUserData()!.role === UserRole.REVIEWER);
      this.userData.set(this.localStorageService.getUserData()!);
    }
  }

  public getUser() {
    return this.http.get<object, UserResDto>('/user', {}).pipe(
      tap(userRes => {
        this.isReviewer.set(userRes.role === UserRole.REVIEWER);
        this.userData.set(userRes);

        this.localStorageService.setUserData({ fullName: userRes.fullName, role: userRes.role });
      })
    );
  }
}
