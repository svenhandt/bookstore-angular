import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-login-register-page',
  templateUrl: './login-register-page.component.html',
  styleUrls: ['./login-register-page.component.css']
})
export class LoginRegisterPageComponent implements OnInit {

  @ViewChild('registerForm', {static: false}) registerForm: NgForm;

  constructor() { }

  ngOnInit(): void {
  }

  registerPasswordFieldValuesEqual() {
    const registerPassword = this.registerForm.value.registerPassword
    const registerPasswordRepeat = this.registerForm.value.registerPasswordRepeat
    return registerPassword === registerPasswordRepeat
  }

  onRegister(){

  }

}
