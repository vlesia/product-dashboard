import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

import { Product, Pagination } from './../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'https://mammoth-testing-api.webinone.com/items';

  private httpClient = inject(HttpClient);

  getItems(
    query: string = '',
    limit: number = 10,
    page: number = 1
  ): Observable<{ products: Product[]; pagination: Pagination }> {
    const params = new HttpParams()
      .set('query', query)
      .set('limit', limit)
      .set('page', page)
      .set('prop_ModuleId', 2053);

    return this.httpClient.get<any>(this.baseUrl, { params }).pipe(
      map((response) => {
        const items = response.Items || [];
        const transformedItems = items.map((item: any) => ({
          image: item.Image,
          name: item.Name || 'Unknown name',
          category: item.Category || 'Unknown category',
          price: item.ProductPrice || '',
          country: this.formatCountry(item.Country),
          marketplaceStatus: item.Status || 'Unknown',
        }));

        return {
          products: transformedItems,
          pagination: response.Pagination || {},
        };
      }),
      catchError((error) => {
        return throwError(
          () =>
            new Error(
              'Something went wrong while fetching the data. Please try again later.'
            )
        );
      })
    );
  }

  private formatCountry(country: string): string {
    try {
      const parsed = JSON.parse(country);
      return Array.isArray(parsed) ? parsed.join(', ') : parsed;
    } catch {
      return 'Unknown country';
    }
  }
}
