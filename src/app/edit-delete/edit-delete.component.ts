import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
  IonButtons, IonButton, IonIcon, IonProgressBar, IonCard,
  IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent,
  IonChip, IonLabel, IonBadge, IonItem, IonList, IonInput,
  IonSelect, IonSelectOption, IonText, IonToggle, IonModal,
  IonFooter, IonAlert
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  createOutline, trashOutline, refreshOutline, archiveOutline,
  saveOutline, closeOutline, searchOutline, helpCircleOutline
} from 'ionicons/icons';
import { InventoryService } from '../services/inventory.service';
import { InventoryItem } from '../models/inventory.model';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit-delete',
  templateUrl: './edit-delete.component.html',
  styleUrls: ['./edit-delete.component.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle,
    IonContent, IonSearchbar, IonButtons, IonButton, IonIcon,
    IonProgressBar, IonCard, IonCardHeader, IonCardSubtitle,
    IonCardTitle, IonCardContent, IonChip, IonLabel, IonBadge,
    IonItem, IonList, IonInput, IonSelect, IonSelectOption,
    IonText, IonToggle, IonModal, IonFooter, IonAlert
  ]
})
export class EditDeleteComponent implements OnInit {
  displayList: InventoryItem[] = [];
  searchQuery: string = '';
  showLoading: boolean = false;
  showEditModal = false;
  editingItem: Partial<InventoryItem> = {};
  isSaving = false;
  showDeleteAlert = false;
  deletingItem: InventoryItem | null = null;

  deleteAlertButtons = [
    { text: 'Cancel', role: 'cancel', handler: () => this.showDeleteAlert = false },
    { text: 'Delete', role: 'destructive', handler: () => this.onDeleteConfirmed() }
  ];

  categoryOptions = [
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Furniture', label: 'Furniture' },
    { value: 'Clothing', label: 'Clothing' },
    { value: 'Tools', label: 'Tools' },
    { value: 'Miscellaneous', label: 'Miscellaneous' }
  ];

  constructor(
    private apiService: InventoryService,
    private toastController: ToastController
  ) {
    addIcons({ 
      createOutline, trashOutline, refreshOutline, archiveOutline, 
      saveOutline, closeOutline, searchOutline, helpCircleOutline 
    });
  }

  ngOnInit() { this.loadData(); }

  loadData() {
    this.showLoading = true;
    this.apiService.getAll().subscribe({
      next: (data) => { this.displayList = data; this.showLoading = false; },
      error: () => { this.showLoading = false; this.displayList = []; }
    });
  }

  onSearch() {
    if (!this.searchQuery.trim()) { this.loadData(); return; }
    this.showLoading = true;
    this.apiService.getByName(this.searchQuery.trim()).subscribe({
      next: (item) => { this.displayList = (item && item.item_name) ? [item] : []; this.showLoading = false; },
      error: () => { this.displayList = []; this.showLoading = false; }
    });
  }

  openEdit(item: InventoryItem) { this.editingItem = { ...item }; this.showEditModal = true; }
  closeEdit() { this.showEditModal = false; }

  async saveEdit() {
    this.isSaving = true;
    const name = this.editingItem.item_name!;
    this.apiService.update(name, this.editingItem).subscribe({
      next: () => {
        this.isSaving = false;
        this.presentToast('Updated!', 'success');
        this.showEditModal = false;
        this.loadData();
      },
      error: () => { this.isSaving = false; this.presentToast('Update failed', 'danger'); }
    });
  }

  confirmDelete(item: InventoryItem) { this.deletingItem = item; this.showDeleteAlert = true; }

  onDeleteConfirmed() {
    this.apiService.delete(this.deletingItem!.item_name).subscribe({
      next: () => { this.presentToast('Deleted!', 'success'); this.loadData(); },
      error: (err) => { this.presentToast('Cannot delete Laptop or connection error', 'danger'); }
    });
  }

  showHelp() {
    alert("MANAGE HELP:\n- Search items to Edit or Delete.\n- Deleting 'Laptop' is restricted by the server.\n- All changes are synced to ArtGalley.");
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({ message, duration: 2000, color, position: 'bottom' });
    toast.present();
  }
}
