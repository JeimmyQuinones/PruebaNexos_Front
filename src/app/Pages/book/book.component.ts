import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
//ng add @ng-bootstrap/ng-bootstrap

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Appservice } from '../../Service/Appservice.service';
import { EditorialModel } from 'src/app/Models/Editorial.model';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  ////////////////////variables
Nombremodal:string="Editar";
ideliminar:number;
NombreEliminar:string="";
showModal:BsModalRef;
EliminarModal:BsModalRef;
MaximoEditorial:BsModalRef;
forma:FormGroup;
ListUsuarios:any[]=[];
loading:boolean=false;
loadingUser:boolean=false;
loadingsave:boolean=false;
ListEditorial:any[]=[];
ListAutor:any[]=[];
Maximoalcanzado:boolean=false;
editorialIdNovalido:boolean=false;
authorIdNovalido:boolean=false;

////////////////////////////////7

  constructor( private modalService: BsModalService, private fb: FormBuilder, private Modelservice:Appservice) { 
    this.Getlist();
    this.Crearformulario();
  }
  /////////////////validaciones
  get titleNovalido(){
    return this.forma.get('title').invalid && this.forma.get('title').touched
  }
  get yearNovalido(){
    return this.forma.get('year').invalid && this.forma.get('year').touched
  }
  get genreNovalido(){
    return this.forma.get('genre').invalid && this.forma.get('genre').touched
  }
  get numberpageNovalido(){
    return this.forma.get('numberpage').invalid && this.forma.get('numberpage').touched && this.forma.get('numberpage').value==0
  }
 /* get editorialIdNovalido(){
    return this.forma.get('editorialId').invalid && this.forma.get('editorialId').touched && this.forma.get('editorialId').value ==-1
  }
  get authorIdNovalido(){
    return this.forma.get('authorId').invalid && this.forma.get('authorId').touched && this.forma.get('authorId').value ==-1
  }*/
////////////////////////////
  
  ngOnInit(): void {
  }
  Crearformulario(){
    this.forma= this.fb.group({
      bookId:[''],
      title:['',[Validators.required, Validators.minLength(5)]],
      year:['',[Validators.required, Validators.minLength(4)]],
      genre:['',[Validators.required, Validators.minLength(4)]],
      numberpage:['',[Validators.required]],
      editorialId:[''],
      authorId:[''],
    });
  }
  openmodal(template: TemplateRef<any>, nombre:string){
    this.forma.reset(
      {
        editorialId: '-1',
        authorId: '-1'
      })
    this.Nombremodal= nombre;
    this.Getlistoptions();
    this.showModal=this.modalService.show(template);
  }
  closemodal(){
    this.showModal.hide();
    this.Maximoalcanzado=false;
    this.forma.reset(
      {
        editorialId: '-1',
        authorId: '-1'
      })
  }
  openmodalEliminar(template: TemplateRef<any>, id:number,nombre:string){
    this.NombreEliminar= nombre;
    this.ideliminar=id;
    this.EliminarModal=this.modalService.show(template);
  }
  closemodalEliminar(){
    this.EliminarModal.hide();
  }
  Guardar( ){
    if(this.forma.value.editorialId==-1){
      this.editorialIdNovalido=true;
    }else{
      this.editorialIdNovalido=false;
    }
    if(this.forma.value.authorId==-1){
      this.authorIdNovalido=true;
    }else{
      this.authorIdNovalido=false;
    }
    if(this.forma.invalid){
      Object.values(this.forma.controls).forEach(control=>{
          control.markAllAsTouched();
      });
    }else if(this.editorialIdNovalido==false&& this.authorIdNovalido==false){
      let user= this.forma.value;
        user.editorialId=parseInt(user.editorialId);
        user.authorId=parseInt(user.authorId);
        user.bookId=parseInt(user.bookId);
        user.year=parseInt(user.year);
        user.numberpage=parseInt(user.numberpage);
      if(this.Nombremodal==="Editar"){
        this.Save(user);
      }else{
        this.Add(user);
      }
      
    }
  }

Editar(template: TemplateRef<any>, id:number){
    this.openmodal(template,"Editar");
    this.Cargardataalformulario(id);
  }
  Cargardataalformulario(id:number){
    this.loadingUser=true;
    this.Modelservice.getBook(id)
    .subscribe((data:any)=>{
        this.forma.reset({
          bookId:data.bookId,
          title:data.title,
          year:data.year,
          genre:data.genre,
          numberpage:data.numberpage,
          editorialId:data.editorialId,
          authorId:data.authorId,
      });
        this.loadingUser=false;
    },(error)=>{
      this.loadingUser=false;
    });
     
  }
  Search(text:string){
    if (text.length==0){
      this.Getlist();
    }
    this.Modelservice.getSearch(text)
    .subscribe((data:any)=>{
      console.log(data);
      this.ListUsuarios=data;
    },(error)=>{
      console.log("Error");
    });
  }
  Getlistoptions(){
    this.Modelservice.getEditorials()
    .subscribe((data:any)=>{
      this.ListEditorial=data;
    },(error)=>{
      console.log("Error");
    });
    this.Modelservice.getAuthors()
    .subscribe((data:any)=>{
      this.ListAutor=data;
      console.log(data);
    },(error)=>{
      console.log("Error");
    });
  }

  Getlist(){
    this.loading=true;
    this.Modelservice.getBooks()
    .subscribe((data:any)=>{
      console.log(data);
        this.ListUsuarios= data;
        this.loading=false;
    },(error)=>{
      console.log("Error");
      this.loading=false;
    });
  }
  Add(Book){
    this.loadingsave=true;
    this.Modelservice.addBook(Book)
    .subscribe((data:any)=>{
      if(data=="Maxioalcanzado"){
        this.Maximoalcanzado=true;
      }else{
        this.Maximoalcanzado=false;
      }
      this.Getlist();
      this.loadingsave=false;
    },(error)=>{
      console.log(error);
      this.loadingsave=false;
    });
  }
  Save(Book){
    this.loadingsave=true;
    this.Modelservice.saveBook(Book)
    .subscribe((data:any)=>{
      if(data=="Maxioalcanzado"){
        this.Maximoalcanzado=true;
      }else{
        this.Maximoalcanzado=false;
      }
     
      this.Getlist();
      this.loadingsave=false;
    },(error)=>{
      console.log(error);
      this.loadingsave=false;
    });
  }
  Delete(){
    this.Modelservice.deleteBook( this.ideliminar)
    .subscribe((data:any)=>{
      console.log(data);
      this.Getlist();
      this.closemodalEliminar();
    },(error)=>{
      console.log(error);
    });
  }
}



