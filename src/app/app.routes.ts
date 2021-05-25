import { Route } from '@angular/compiler/src/core';
import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorComponent } from './Pages/author/author.component';
import { EditorialComponent } from './Pages/editorial/editorial.component';
import { BookComponent } from './Pages/book/book.component';

const APP_ROUTES:Routes=[
    {path:'Autores', component:AuthorComponent },
    {path:'Editoriales', component: EditorialComponent},
    {path:'Books', component: BookComponent},
    {path:'**', pathMatch:'full', redirectTo:'Autores' }
];

export const App_routing = RouterModule.forRoot(APP_ROUTES);