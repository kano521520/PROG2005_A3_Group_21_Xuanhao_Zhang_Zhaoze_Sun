import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, 
  IonCardHeader, IonCardTitle, IonCardContent, IonButtons, 
  IonButton, IonIcon, IonText, IonList, IonItem, IonLabel 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { helpCircleOutline, shieldCheckmarkOutline, lockClosedOutline, serverOutline } from 'ionicons/icons';

@Component({
  selector: 'app-privacy-security',
  templateUrl: './privacy-security.component.html',
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, 
    IonCardHeader, IonCardTitle, IonCardContent, IonButtons, 
    IonButton, IonIcon, IonText, IonList, IonItem, IonLabel
  ]
})
export class PrivacySecurityComponent {
  constructor() {
    addIcons({ helpCircleOutline, shieldCheckmarkOutline, lockClosedOutline, serverOutline });
  }

  showHelp() {
    alert("SECURITY HELP:\n- This page details mobile app security best practices.\n- Analysis covers data validation and transmission safety.");
  }
}
