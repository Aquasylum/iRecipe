import {
  Auth,
  updateProfile,
  sendEmailVerification,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
import { HttpErrorResponse } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { ILoginData } from '../Interfaces/ILoginData';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

  async login(login: ILoginData) {
    return await signInWithEmailAndPassword(
      this.auth,
      login.email,
      login.password
    ).catch((e: HttpErrorResponse) => {
      throw e;
    });
  }

  async loginWithGoogle() {
    return await signInWithPopup(this.auth, new GoogleAuthProvider());
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
    )
      .then((cred) => {
        updateProfile(cred.user, {
          displayName: register.username,
        });

        sendEmailVerification(cred.user);
      })
      .catch((e: HttpErrorResponse) => {
        throw e;
      });
  }

  async resetPassword(email: string) {
    await sendPasswordResetEmail(this.auth, email).catch(
      (e: HttpErrorResponse) => {
        throw e;
      }
    );
  }

  logout() {
    return signOut(this.auth);
  }
}
