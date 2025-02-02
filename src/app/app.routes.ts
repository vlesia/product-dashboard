import { Routes } from '@angular/router';

import { ProductListComponent } from './pages/product-list/product-list.component';
import { AccountComponent } from './pages/account/account.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  { path: 'account', component: AccountComponent },
];
