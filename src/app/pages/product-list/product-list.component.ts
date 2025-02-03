import { ProductService } from './../../services/product.service';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

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
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
  private destroy$ = new Subject<void>();

  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public ngOnInit(): void {
    this.loadItems();
    this.updateUrl();

    this.searchQuery.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.currentPage = 1;
          if (this.paginator) this.paginator.firstPage();
          this.loadItems();
          this.updateUrl();
        },
      });
  }

  public onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.loadItems();
    this.updateUrl();
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadItems(): void {
    this.error = '';

    this.productService
      .getItems(
        this.searchQuery.value || '',
        this.itemsPerPage,
        this.currentPage,
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.products = data.products;
          this.totalItems = data.pagination.TotalItemsCount || 0;
        },
        error: (error) => (this.error = error.message),
      });
  }

  private updateUrl(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage,
        size: this.itemsPerPage,
        search: this.searchQuery.value || undefined,
      },
      queryParamsHandling: 'merge',
    });
  }
}
