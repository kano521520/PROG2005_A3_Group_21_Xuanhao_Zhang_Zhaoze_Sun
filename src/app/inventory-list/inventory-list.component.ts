import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, 
  IonButtons, IonButton, IonIcon, IonBadge, IonProgressBar, 
  IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, 
  IonCardContent, IonChip, IonLabel 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { helpCircleOutline, star, refreshOutline, archiveOutline } from 'ionicons/icons';
import { InventoryService } from '../services/inventory.service';
import { InventoryItem } from '../models/inventory.model';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonSearchbar, IonButtons, IonButton, IonIcon, IonBadge, 
    IonProgressBar, IonCard, IonCardHeader, IonCardSubtitle, 
    IonCardTitle, IonCardContent, IonChip, IonLabel
  ]
})
export class InventoryListComponent implements OnInit {
  displayList: InventoryItem[] = [];
  searchQuery: string = '';
  showLoading: boolean = false;

  constructor(private apiService: InventoryService) {
    addIcons({ helpCircleOutline, star, refreshOutline, archiveOutline });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.showLoading = true;
    this.apiService.getAll().subscribe({
      next: (data: InventoryItem[]) => {
        this.displayList = data;
        this.showLoading = false;
      },
      error: () => {
        this.showLoading = false;
        this.displayList = [];
      }
    });
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.loadData();
      return;
    }
    this.showLoading = true;
    this.apiService.getByName(this.searchQuery.trim()).subscribe({
      next: (item: InventoryItem) => {
        this.displayList = (item && item.item_name) ? [item] : [];
        this.showLoading = false;
      },
      error: () => {
        this.displayList = [];
        this.showLoading = false;
      }
    });
  }

  showPageHelp() {
    alert("Help: Search products by name. Star indicates featured items.");
  }
}