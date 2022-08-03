import {
  Auth,
  updateProfile,
  sendEmailVerification,
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
    return signInWithEmailAndPassword(this.auth, login.email, login.password);
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  getCurrentUserDisplayName() {
    return this.auth.currentUser?.displayName;
  }

  async register(register: ILoginData) {
    await createUserWithEmailAndPassword(
      this.auth,
      register.email,
      register.password
    ).then((cred) => {
      updateProfile(cred.user, {
        displayName: register.username,
      });

      sendEmailVerification(cred.user);
    });
  }

  logout() {
    return signOut(this.auth);
  }
}
