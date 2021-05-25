import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
//ng add @ng-bootstrap/ng-bootstrap

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Appservice } from '../../Service/Appservice.service';
import { AuthorModel } from 'src/app/Models/Author.model';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit {
  ////////////////////variables
Nombremodal:string="Editar";
ideliminar:number;
NombreEliminar:string="";
showModal:BsModalRef;
EliminarModal:BsModalRef;
forma:FormGroup;
ListUsuarios:any[]=[];
loading:boolean=false;
loadingUser:boolean=false;
loadingsave:boolean=false;
Autor= new AuthorModel();

////////////////////////////////7

  constructor( private modalService: BsModalService, private fb: FormBuilder, private Modelservice:Appservice) { 
    this.Getlist();
    this.Crearformulario();
  }
  /////////////////validaciones
  get nameNovalido(){
    return this.forma.get('name').invalid && this.forma.get('name').touched
  }
  get birthdateNovalido(){
    return this.forma.get('birthdate').value==null && this.forma.get('birthdate').touched
  }
  get emailNovalido(){
    return this.forma.get('email').invalid && this.forma.get('email').touched
  }
  get townNovalido(){
    return this.forma.get('town').invalid && this.forma.get('town').touched
  }
////////////////////////////
  
  ngOnInit(): void {
  }
  Crearformulario(){
    this.forma= this.fb.group({
      authorId:[''],
      name:['',[Validators.required, Validators.minLength(5)]],
      birthdate:['',[Validators.required]],
      town:['',[Validators.required, Validators.minLength(5)]],
      email:['',[Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
    });
  }
  openmodal(template: TemplateRef<any>, nombre:string){
    this.Nombremodal= nombre;
    this.showModal=this.modalService.show(template);
  }
  closemodal(){
    this.showModal.hide();
      this.forma.reset();
  }
  openmodalEliminar(template: TemplateRef<any>, id:number,nombre:string){
    this.NombreEliminar= nombre;
    this.ideliminar=id;
    this.EliminarModal=this.modalService.show(template);
  }
  closemodalEliminar(){
    this.EliminarModal.hide();
  }
  Guardar(){
    console.log(this.forma.value.birthdate)
    if(this.forma.invalid){
      Object.values(this.forma.controls).forEach(control=>{
          control.markAllAsTouched();
      });
    }else{
      let user= this.forma.value;
        user.authorId=parseInt(user.authorId);
      if(this.Nombremodal==="Editar"){
        this.Save(user);
      }else{
        this.Add(user);
      }
      
    }
  }
  Editar(template: TemplateRef<any>, id:number){
    this.Cargardataalformulario(id);
    this.openmodal(template,"Editar");
  
  }
  Cargardataalformulario(id:number){
    this.loadingUser=true;
    this.Modelservice.getAuthor(id)
    .subscribe((data:any)=>{
      var fecha= new Date(data.birthdate);
      var mes= "";
      var dia ="";
      var anio=fecha.getFullYear();
      if(fecha.getDate()<10)
        dia='0'+fecha.getDate(); 
        else
        dia= fecha.getDate().toString();
      if((fecha.getMonth()+1)<10)
        mes='0'+(fecha.getMonth()+1)
        else
        mes=(fecha.getMonth()+1).toString();
        
      console.log(anio+"-"+mes+"-"+dia);
        this.forma.reset({
          authorId: data.authorId,
          name: data.name,
          birthdate: anio+"-"+mes+"-"+dia,
          town:data.town,
          email:data.email,
      });
        this.loadingUser=false;
    },(error)=>{
      console.log("Error");
      this.loadingUser=false;
    });
     
  }

  Getlist(){
    this.loading=true;
    this.Modelservice.getAuthors()
    .subscribe((data:any)=>{
      console.log(data);
        this.ListUsuarios= data;
        this.loading=false;
    },(error)=>{
      console.log("Error");
      this.loading=false;
    });
  }
  Add(Autor){
    this.loadingsave=true;
    this.Modelservice.addAuthor(Autor)
    .subscribe((data:any)=>{
      this.Getlist();
      this.loadingsave=false;
    },(error)=>{
      console.log(error);
      this.loadingsave=false;
    });
  }
  Save(Autor){
    console.log(Autor)
    this.loadingsave=true;
    this.Modelservice.saveAuthor(Autor)
    .subscribe((data:any)=>{
      this.Getlist();
      this.loadingsave=false;
    },(error)=>{
      console.log(error);
      this.loadingsave=false;
    });
  }
  Delete(){
    this.Modelservice.deleteAuthor( this.ideliminar)
    .subscribe((data:any)=>{
      console.log(data);
      this.Getlist();
      this.closemodalEliminar();
    },(error)=>{
      console.log(error);
    });
  }
}

