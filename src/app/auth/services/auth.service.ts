import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';

import { Injectable } from '@angular/core';
import { ILoginData } from '../../models/Interfaces/ILoginData';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

  login(login: ILoginData) {
    console.log(login);
    return signInWithEmailAndPassword(this.auth, login.email, login.password);
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  register(register: ILoginData) {
    return createUserWithEmailAndPassword(
      this.auth,
      register.email,
      register.password
    );
  }

  logout() {
    return signOut(this.auth);
  }
}
