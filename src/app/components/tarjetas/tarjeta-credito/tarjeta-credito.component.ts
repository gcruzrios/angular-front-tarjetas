import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms'
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { TarjetaCredito } from 'src/app/models/tarjetaCredito';
import { TarjetaService } from 'src/app/services/tarjeta.service';
@Component({
  selector: 'app-tarjeta-credito',
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent implements OnInit, OnDestroy  {

  form: FormGroup;
  suscription: Subscription;
  tarjeta: TarjetaCredito;
  idTarjeta = 0;

  constructor(private formBuilder: FormBuilder, private tarjetaService: TarjetaService, private toastr: ToastrService  ) {
    this.form = this.formBuilder.group({
      id: 0,
      titular: ['',[Validators.required]],
      numeroTarjeta: ['',[Validators.required, Validators.maxLength(16), Validators.minLength(16)]],
      fechaExpiracion: ['',[Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
      cvv: ['',[Validators.required, Validators.maxLength(3), Validators.minLength(3)]],
    })
   }

  ngOnInit(): void {
    this.suscription = this.tarjetaService.obtenerTarjeta$().subscribe(data=>{
      console.log(data);
      this.tarjeta = data;
      this.form.patchValue({
        titular: this.tarjeta.titular,
        numeroTarjeta: this.tarjeta.numeroTarjeta,
        fechaExpiracion : this.tarjeta.fechaExpiracion,
        cvv: this.tarjeta.cvv
      });
      this.idTarjeta = this.tarjeta.id;
    });

  }

  ngOnDestroy(){
    this.suscription.unsubscribe();
  }

  guardarTarjeta(){
    //console.log(this.form);
    if(this.idTarjeta === 0 || this.idTarjeta ===undefined){
      this.agregar();
    }else{
      this.editar();
    }

    
  }

  agregar(){
    const tarjeta : TarjetaCredito = {
      titular: this.form.get('titular').value,
      numeroTarjeta: this.form.get('numeroTarjeta').value,
      fechaExpiracion: this.form.get('fechaExpiracion').value,
      cvv: this.form.get('cvv').value,
      

     }
    this.tarjetaService.guardarTarjeta(tarjeta).subscribe(data => {
      console.log("Guardado Exitoso");
      this.toastr.success('Registro Agregado', 'La tarjeta fue Agregada');
      this.tarjetaService.obtenerTarjetas();
      this.form.reset();
    })
  }
  
  editar(){
    const tarjeta : TarjetaCredito = {
      id: this.tarjeta.id,
      titular: this.form.get('titular').value,
      numeroTarjeta: this.form.get('numeroTarjeta').value,
      fechaExpiracion: this.form.get('fechaExpiracion').value,
      cvv: this.form.get('cvv').value,
      

     }
        this.tarjetaService.actualizarTarjeta(this.idTarjeta, tarjeta).subscribe(data => {
        this.toastr.info('Registro actualizado', 'La tarjeta fue Actualizada');
        this.tarjetaService.obtenerTarjetas();
        this.form.reset();
        this.idTarjeta = 0;
      });
  }  
}
