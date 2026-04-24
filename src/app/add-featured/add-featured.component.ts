// add-featured/add-featured.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonText,
  IonToggle,
  IonProgressBar,
  IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveOutline, closeOutline, addCircleOutline } from 'ionicons/icons';
import { InventoryService } from '../services/inventory.service';
import { InventoryItem } from '../models/inventory.model';
import { NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-featured',
  templateUrl: './add-featured.component.html',
  styleUrls: ['./add-featured.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonText,
    IonToggle,
    IonProgressBar
  ]
})
export class AddFeaturedComponent {
  newItem: Partial<InventoryItem> = {
    item_name: '',
    category: '',
    supplier_name: '',
    price: 0,
    quantity: 0,
    featured_item: 0,
    stock_status: 'Out of stock',
    special_note: ''
  };

  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastColor = '';

  constructor(
    private inventoryService: InventoryService,
    private navCtrl: NavController,
    private toastController: ToastController,
    private router: Router
  ) {
    addIcons({ saveOutline, closeOutline, addCircleOutline });
  }

  // 监听数量变化，自动更新库存状态
  onQuantityChange() {
    const qty = Number(this.newItem.quantity) || 0;
    this.newItem.stock_status = qty > 0 ? 'In stock' : 'Out of stock';
  }

  async saveItem() {
    // 表单验证
    if (!this.newItem.item_name?.trim()) {
      this.presentToast('Please enter item name', 'danger');
      return;
    }
    if (this.newItem.item_name.trim().length > 50) {
      this.presentToast('Item name must be 50 characters or less', 'danger');
      return;
    }
    if (!this.newItem.category?.trim()) {
      this.presentToast('Please enter category', 'danger');
      return;
    }
    if (this.newItem.category.trim().length > 20) {
      this.presentToast('Category must be 20 characters or less', 'danger');
      return;
    }
    if (!this.newItem.supplier_name?.trim()) {
      this.presentToast('Please enter supplier name', 'danger');
      return;
    }
    if (this.newItem.supplier_name.trim().length > 50) {
      this.presentToast('Supplier name must be 50 characters or less', 'danger');
      return;
    }
    const price = Number(this.newItem.price);
    if (isNaN(price) || price < 0) {
      this.presentToast('Please enter a valid price (≥ 0)', 'danger');
      return;
    }
    const quantity = Number(this.newItem.quantity);
    if (isNaN(quantity) || quantity < 0 || !Number.isInteger(quantity)) {
      this.presentToast('Please enter a valid quantity (non-negative integer)', 'danger');
      return;
    }

    // 构建完整的货品对象 - 确保所有字段长度和类型符合数据库限制
    const itemToAdd = {
      item_name: String(this.newItem.item_name!.trim()).substring(0, 50),
      category: String(this.newItem.category!.trim()).substring(0, 15),
      price: Number(price),
      quantity: Number(quantity),
      featured_item: Number(this.newItem.featured_item) ? 1 : 0,
      stock_status: quantity > 0 ? 'In stock' : 'Out of stock',
      supplier_name: String(this.newItem.supplier_name?.trim() || '').substring(0, 50),
      special_note: this.newItem.special_note?.trim() || null
    };

    console.log('Sending item:', JSON.stringify(itemToAdd));

    this.isLoading = true;
    this.inventoryService.addItem(itemToAdd).subscribe({
      next: () => {
        this.isLoading = false;
        this.presentToast('Item added successfully!', 'success');
        console.log("233")
        // 改为显式导航到库存列表页，路径请根据实际路由配置修改
        this.router.navigate(['/tabs/inventory-list']);
      },
      error: (err) => {
        console.error('Add item error:', err);
        this.isLoading = false;
        this.presentToast('Failed to add item. Please try again.', 'danger');
      }
    });
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

  cancel() {
    this.navCtrl.back();
  }
}