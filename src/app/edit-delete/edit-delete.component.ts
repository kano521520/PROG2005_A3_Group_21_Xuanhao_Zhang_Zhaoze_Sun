import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonProgressBar,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonChip,
  IonLabel,
  IonBadge,
  IonItem,
  IonList,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonText,
  IonToggle,
  IonToast,
  IonModal,
  IonFooter,
  IonAlert
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  createOutline,
  trashOutline,
  refreshOutline,
  archiveOutline,
  saveOutline,
  closeOutline,
  searchOutline
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
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonProgressBar,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonChip,
    IonLabel,
    IonBadge,
    IonItem,
    IonList,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonText,
    IonToggle,
    IonToast,
    IonModal,
    IonFooter,
    IonAlert
  ]
})
export class EditDeleteComponent implements OnInit {
  displayList: InventoryItem[] = [];
  searchQuery: string = '';
  showLoading: boolean = false;

  // Edit modal
  showEditModal = false;
  editingItem: Partial<InventoryItem> = {};
  isSaving = false;

  // Delete confirmation
  showDeleteAlert = false;
  deletingItem: InventoryItem | null = null;
  deleteAlertButtons: any[] = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => this.cancelDelete()
    },
    {
      text: 'Delete',
      role: 'destructive',
      handler: () => this.onDeleteConfirmed()
    }
  ];

  // Toast
  toastMessage = '';
  toastColor = '';

  // Category options
  categoryOptions = [
    { value: '1', label: 'Electronics' },
    { value: '2', label: 'Furniture' },
    { value: '3', label: 'Clothing' },
    { value: '4', label: 'Tools' },
    { value: '5', label: 'Miscellaneous' }
  ];

  constructor(
    private apiService: InventoryService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({ createOutline, trashOutline, refreshOutline, archiveOutline, saveOutline, closeOutline, searchOutline });
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

  // ========== Edit ==========
  openEdit(item: InventoryItem) {
    this.editingItem = { ...item };
    this.showEditModal = true;
  }

  closeEdit() {
    this.showEditModal = false;
    this.editingItem = {};
  }

  async saveEdit() {
    // Validation
    if (!this.editingItem.item_name?.trim()) {
      this.presentToast('Please enter item name', 'danger');
      return;
    }
    if (!this.editingItem.category) {
      this.presentToast('Please select a category', 'danger');
      return;
    }
    const validCategories = ['1', '2', '3', '4', '5'];
    if (!validCategories.includes(String(this.editingItem.category))) {
      this.presentToast('Please select a valid category', 'danger');
      return;
    }
    if (!this.editingItem.supplier_name?.trim()) {
      this.presentToast('Please enter supplier name', 'danger');
      return;
    }
    const price = Number(this.editingItem.price);
    if (isNaN(price) || price < 0) {
      this.presentToast('Please enter a valid price (≥ 0)', 'danger');
      return;
    }
    const quantity = Number(this.editingItem.quantity);
    if (isNaN(quantity) || quantity < 0 || !Number.isInteger(quantity)) {
      this.presentToast('Please enter a valid quantity (non-negative integer)', 'danger');
      return;
    }

    const itemToUpdate = {
      item_name: String(this.editingItem.item_name!.trim()).substring(0, 50),
      category: String(this.editingItem.category).substring(0, 15),
      price: Number(price),
      quantity: Number(quantity),
      featured_item: Number(this.editingItem.featured_item) ? 1 : 0,
      stock_status: quantity > 0 ? 'In stock' : 'Out of stock',
      supplier_name: String(this.editingItem.supplier_name?.trim() || '').substring(0, 50),
      special_note: this.editingItem.special_note?.trim() || null
    };

    this.isSaving = true;
    // Use the original item name as the identifier for the API
    const originalName = this.editingItem.item_name;
    this.apiService.update(originalName!, itemToUpdate).subscribe({
      next: () => {
        this.isSaving = false;
        this.presentToast('Item updated successfully!', 'success');
        this.closeEdit();
        this.loadData();
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Update error:', err);
        this.presentToast('Failed to update item. Please try again.', 'danger');
      }
    });
  }

  // ========== Delete ==========
  confirmDelete(item: InventoryItem) {
    this.deletingItem = item;
    this.showDeleteAlert = true;
  }

  async onDeleteConfirmed() {
    if (!this.deletingItem?.item_name) return;

    const nameToDelete = this.deletingItem.item_name;
    this.showDeleteAlert = false;

    this.showLoading = true;
    this.apiService.delete(nameToDelete).subscribe({
      next: () => {
        this.showLoading = false;
        this.presentToast('Item deleted successfully!', 'success');
        this.deletingItem = null;
        this.loadData();
      },
      error: (err) => {
        this.showLoading = false;
        console.error('Delete error:', err);
        this.presentToast('Failed to delete item. Please try again.', 'danger');
        this.deletingItem = null;
      }
    });
  }

  cancelDelete() {
    this.showDeleteAlert = false;
    this.deletingItem = null;
  }

  // ========== Helpers ==========
  getCategoryLabel(value: string | number): string {
    const found = this.categoryOptions.find(c => c.value === String(value));
    return found ? found.label : String(value);
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }
}
