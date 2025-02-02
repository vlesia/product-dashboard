import { ProductService } from './../../services/product.service';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit, OnDestroy {
  public tableColumns: string[] = [
    'image',
    'name',
    'category',
    'price',
    'country',
    'marketplace status',
    'action',
  ];
  public products: Product[] = [];
  public totalItems = 0;
  public itemsPerPage = 10;
  public currentPage = 1;
  public searchQuery = new FormControl('');
  public error = '';

  private productService = inject(ProductService);
  private destroy$ = new Subject<void>();

  public ngOnInit(): void {
    this.loadItems();

    this.searchQuery.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.currentPage = 1;
          this.loadItems();
        },
      });
  }

  public loadItems(): void {
    this.error = '';
    
    this.productService
      .getItems(
        this.searchQuery.value || '',
        this.itemsPerPage,
        this.currentPage
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.products = data.products;
          this.totalItems = data.pagination.TotalItemsCount || 0;
        },
        error: (error) => this.error = error.message,
      });
  }

  public onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.loadItems();
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
