import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryItem } from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private readonly API_URL = 'https://prog2005.it.scu.edu.au/ArtGalley';

  constructor(private http: HttpClient) {}

  getAll(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.API_URL);
  }

  getByName(name: string): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${this.API_URL}/${name}`);
  }

  add(item: any): Observable<any> {
    return this.http.post(this.API_URL, item);
  }

  update(name: string, item: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${name}`, item);
  }

  delete(name: string): Observable<string> {
    return this.http.delete(`${this.API_URL}/${name}`, { responseType: 'text' });
  }
}