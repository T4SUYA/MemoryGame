import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LottiePlayerComponent } from './components/lottie-player/lottie-player.component';

import { AuthService } from './services/auth.service';

const modules = [FormsModule, ReactiveFormsModule];

@NgModule({
  declarations: [LottiePlayerComponent],
  imports: [CommonModule, modules],
  exports: [modules, LottiePlayerComponent],
  providers: [AuthService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
