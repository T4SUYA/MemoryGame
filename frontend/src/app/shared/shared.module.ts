import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LeadboardComponent } from './components/leadboard/leadboard.component';
import { LottiePlayerComponent } from './components/lottie-player/lottie-player.component';
import { AuthService } from './services/auth.service';

const modules = [FormsModule, ReactiveFormsModule];
const materialModules = [
  MatAutocompleteModule,
  MatButtonModule,
  MatDatepickerModule,
  MatDialogModule,
  MatInputModule,
  MatIconModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatSnackBarModule,
  MatSliderModule,
];

@NgModule({
  declarations: [LottiePlayerComponent, LeadboardComponent],
  imports: [CommonModule, modules, materialModules],
  exports: [
    modules,
    materialModules,
    LottiePlayerComponent,
    LeadboardComponent,
  ],
  providers: [AuthService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
