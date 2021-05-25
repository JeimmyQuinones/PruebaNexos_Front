import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
//ng add @ng-bootstrap/ng-bootstrap

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Appservice } from '../../Service/Appservice.service';
import { EditorialModel } from 'src/app/Models/Editorial.model';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-editorial',
  templateUrl: './editorial.component.html',
  styleUrls: ['./editorial.component.css']
})
export class EditorialComponent implements OnInit {
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
Autor= new EditorialModel();

////////////////////////////////7

  constructor( private modalService: BsModalService, private fb: FormBuilder, private Modelservice:Appservice) { 
    this.Getlist();
    this.Crearformulario();
  }
  /////////////////validaciones
  get nameNovalido(){
    return this.forma.get('name').invalid && this.forma.get('name').touched
  }
  get adressNovalido(){
    return this.forma.get('adress').invalid && this.forma.get('adress').touched
  }
  get emailNovalido(){
    return this.forma.get('email').invalid && this.forma.get('email').touched
  }
  get phoneNovalido(){
    return this.forma.get('phone').invalid && this.forma.get('phone').touched
  }
////////////////////////////
  
  ngOnInit(): void {
  }
  Crearformulario(){
    this.forma= this.fb.group({
      editorialId:[''],
      name:['',[Validators.required, Validators.minLength(5)]],
      adress:['',[Validators.required, Validators.minLength(5)]],
      phone:['',[Validators.required, Validators.minLength(4)]],
      email:['',[Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      maxbookRegister:[''],
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
    if(this.forma.invalid){
      Object.values(this.forma.controls).forEach(control=>{
          control.markAllAsTouched();
      });
    }else{
      let user= this.forma.value;
      console.log(user.maxbookRegister!="");
      if(user.maxbookRegister==""|| user.maxbookRegister===null)
      {
        user.maxbookRegister=-1;
      }
      else{
        user.maxbookRegister=parseInt(user.maxbookRegister);
        
      }
        user.editorialId=parseInt(user.editorialId);
        console.log(this.forma.value);
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
    this.Modelservice.getEditorial(id)
    .subscribe((data:any)=>{
      console.log(data);
        this.forma.reset({
          editorialId: data.editorialId,
          name: data.name,
          adress: data.adress,
          phone: data.phone,
          email: data.email,
          maxbookRegister: data.maxbookRegister,
      });
        this.loadingUser=false;
    },(error)=>{
      console.log("Error");
      this.loadingUser=false;
    });
     
  }

  Getlist(){
    this.loading=true;
    this.Modelservice.getEditorials()
    .subscribe((data:any)=>{
      console.log(data);
        this.ListUsuarios= data;
        this.loading=false;
    },(error)=>{
      console.log("Error");
      this.loading=false;
    });
  }
  Add(Editorial){
    this.loadingsave=true;
    this.Modelservice.addEditorial(Editorial)
    .subscribe((data:any)=>{
      this.Getlist();
      this.loadingsave=false;
    },(error)=>{
      console.log(error);
      this.loadingsave=false;
    });
  }
  Save(Editorial){
    this.loadingsave=true;
    this.Modelservice.saveEditorial(Editorial)
    .subscribe((data:any)=>{
      this.Getlist();
      this.loadingsave=false;
    },(error)=>{
      console.log(error);
      this.loadingsave=false;
    });
  }
  Delete(){
    this.Modelservice.deleteEditorial( this.ideliminar)
    .subscribe((data:any)=>{
      console.log(data);
      this.Getlist();
      this.closemodalEliminar();
    },(error)=>{
      console.log(error);
    });
  }
}


