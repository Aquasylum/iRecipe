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
import { UserService } from 'src/app/user/service/user.service';
import { collection, Firestore, setDoc, doc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  userCollection = collection(this.firestore, 'users');

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
    let user = await signInWithPopup(this.auth, new GoogleAuthProvider());

    if (user) {
      //get display name so we can cut first name
      // and use the remainder as the surname
      let surname: any = user.user.displayName;
      let name = user.user.displayName?.split(' ', 2);

      if (name && user?.user.displayName) {
        surname = surname?.replace(name[0], '');

        await setDoc(doc(this.firestore, 'users', user?.user.displayName), {
          userId: this.getCurrentUser()?.uid,
          username: user?.user.displayName.toLowerCase(),
          name: name[0],
          surname: surname,
        });
      }
    }

    return user;
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
