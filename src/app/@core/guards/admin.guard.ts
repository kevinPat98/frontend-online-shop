import { Injectable } from '@angular/core';
import {
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '@core/services/auth.service';
const jwtDecode = require ('jwt-decode');
@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivateChild {
  constructor(private auth: AuthService, private router: Router) {}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // comprobar que existe sesión
    if (this.auth.getSession() !== null){
      console.log('Estamos logueados');
      const dataDecode = this.decodeToken();
      console.log(dataDecode);
      // Comprobar que no está caducado el token
      if (dataDecode.exp < new Date().getTime() / 1000){
        console.log('sesion caducada');
        return this.redirect();
      }
      // Rol del usuario Admin
      if (dataDecode.user.role === 'ADMIN'){
        console.log('Somos administradores');
        return true;
      }
      console.log('No somos administradores');
    }
    console.log('sesion no iniciada');
    return this.redirect();
  }

  redirect(){
    this.router.navigate(['/login']);
    return false;
  }
 decodeToken(){
    return jwtDecode(this.auth.getSession().token);
  }
}
