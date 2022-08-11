import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscoverComponent } from './components/discover/discover.component';

import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';

@NgModule({
  declarations: [DiscoverComponent, ProfileHeaderComponent],
  imports: [CommonModule],
  exports: [DiscoverComponent, ProfileHeaderComponent],
})
export class UserModule {}
