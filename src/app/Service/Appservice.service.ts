import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Appservice {

  constructor(private http:HttpClient) {  
  }
  private url='https://localhost:44377/Api/';
  private urlprueba='https://localhost:44385/api/API/';

  getAuthors(){
    return this.http.get(this.urlprueba+'GetAuthors');
  }
  getAuthor(id:number){
    return this.http.get(this.urlprueba+'GetAuthorById?id='+id);
  }
  addAuthor(Author:any){
    Author.authorId=0;
    return this.http.post(this.urlprueba+'AddAuthor',Author);
  }
  saveAuthor(Author:any){
    return this.http.put(this.urlprueba+'SaveAuthor',Author);
  }
  deleteAuthor(id:number){
    return this.http.delete(this.urlprueba+'DeleteAuthor?id='+id);
  }
  

  getEditorials(){
    return this.http.get(this.urlprueba+'GetEditorials');
  }
  getEditorial(id:number){
    return this.http.get(this.urlprueba+'GetEditorialById?id='+id);
  }
  addEditorial(Editorial:any){
    Editorial.editorialId=0;
    return this.http.post(this.urlprueba+'AddEditorial',Editorial);
  }
  saveEditorial(Editorial:any){
    return this.http.put(this.urlprueba+'SaveEditorial',Editorial);
  }
  deleteEditorial(id:number){
    return this.http.delete(this.urlprueba+'DeleteEditorial?id='+id);
  }

  getBooks(){
    return this.http.get(this.urlprueba+'GetBooks');
  }
  getBook(id:number){
    return this.http.get(this.urlprueba+'GetBookById?id='+id);
  }
  addBook(Book:any){
    Book.bookId=0;
    return this.http.post(this.urlprueba+'AddBook',Book);
  }
  saveBook(Book:any){
    return this.http.put(this.urlprueba+'SaveBook',Book);
  }
  deleteBook(id:number){
    return this.http.delete(this.urlprueba+'DeleteBook?id='+id);
  }
  getSearch(value:string){
    return this.http.get(this.urlprueba+'GetSearch?value='+value);
  }
}
