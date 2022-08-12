import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscoverComponent } from './components/discover/discover.component';

import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { FileService } from './service/file.service';

@NgModule({
  declarations: [DiscoverComponent, ProfileHeaderComponent],
  imports: [CommonModule],
  exports: [DiscoverComponent, ProfileHeaderComponent],
  providers: [FileService],
})
export class UserModule {}
