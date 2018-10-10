import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './pages/search/search.component';
import { AnalysisComponent } from './pages/analysis/analysis.component';

const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'analysis/:username', component: AnalysisComponent },
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: '**', component: SearchComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
