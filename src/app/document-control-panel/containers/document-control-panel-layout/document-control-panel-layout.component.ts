import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterOutlet } from '@angular/router';
import { LocalStorageService } from '@document-control-app/core/services/local-storage.service';
import { DialogService } from '@document-control-app/core/services/dialog.service';
import { filter } from 'rxjs';
import { UserService } from '@document-control-app/login/shared/services/user.service';
import { SnackBarService } from '@document-control-app/core/services/snackbar.service';
import { DocumentApiService } from '@document-control-app/document-control-panel/shared/services/document-api.service';

@Component({
  selector: 'app-document-control-panel-layout',
  imports: [MatButtonModule, MatIconModule, RouterOutlet, MatSnackBarModule],
  templateUrl: './document-control-panel-layout.component.html',
  styleUrl: './document-control-panel-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentControlPanelLayoutComponent {
  userService = inject(UserService);
  documentChanged$ = inject(DocumentApiService).documentChanged$;

  isReviewer = this.userService.isReviewer;
  userData = this.userService.userData;

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private snackBar: SnackBarService,
    private dialogService: DialogService
  ) {}

  createDocument() {
    this.dialogService.createDocumentDialog();
    this.dialogService.createDocumentDialogRef
      .afterClosed()
      .pipe(filter(value => value))
      .subscribe(() => {
        this.documentChanged$.next();
        this.snackBar.success('Document was saved successfuly');
      });
  }

  logout() {
    this.localStorageService.deleteAuthToken();
    this.localStorageService.deleteUserData();

    this.router.navigate(['login']).then(() => {
      this.snackBar.default('Log out from system');
    });
  }
}
