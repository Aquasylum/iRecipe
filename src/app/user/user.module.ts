import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscoverComponent } from './components/discover/discover.component';
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { FileService } from './service/file.service';
import { ProfileComponent } from './components/profile/profile.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DiscoverComponent, ProfileHeaderComponent, ProfileComponent],
  imports: [CommonModule, SharedModule, RouterModule],
  exports: [DiscoverComponent, ProfileHeaderComponent],
  providers: [FileService],
})
export class UserModule {}
