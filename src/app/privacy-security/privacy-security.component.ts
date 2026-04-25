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
  styleUrls: ['./privacy-security.component.scss'],
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, 
    IonCardHeader, IonCardTitle, IonCardContent, IonButtons, 
    IonButton, IonIcon, IonText, IonList, IonItem, IonLabel
  ]
})
export class PrivacySecurityComponent implements OnInit {
  constructor() {
    addIcons({ helpCircleOutline, shieldCheckmarkOutline, lockClosedOutline, serverOutline });
  }

  ngOnInit() {}

  showHelp() {
    alert("Privacy Page: This section explains the security measures implemented in the ArtGalley Mobile System.");
  }
}
