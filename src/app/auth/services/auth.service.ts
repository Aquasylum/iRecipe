import {
  Auth,
  updateProfile,
  sendEmailVerification,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  UserCredential,
} from '@angular/fire/auth';
import { HttpErrorResponse } from '@angular/common/http';

import { EventEmitter, Injectable } from '@angular/core';
import { ILoginData } from '../Interfaces/ILoginData';
import { collection, Firestore, setDoc, doc } from '@angular/fire/firestore';
import { getDocs, query, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn$: EventEmitter<boolean> = new EventEmitter();

  userCollection = collection(this.firestore, 'users');

  constructor(private auth: Auth, private firestore: Firestore) {
    this.isLoggedIn$.emit(false);
  }

  async loginWithEmailAndPassword(login: ILoginData) {
    let user = await signInWithEmailAndPassword(
      this.auth,
      login.email,
      login.password
    )
      .then((userCredential) => {
        this.emitCurrentLoggedInStatus(true);
        return userCredential;
      })
      .catch((e: HttpErrorResponse) => {
        throw e;
      });

    return user;
  }

  emitCurrentLoggedInStatus(status: boolean) {
    this.isLoggedIn$.emit(status);
  }

  async loginWithGoogle() {
    let user = await signInWithPopup(this.auth, new GoogleAuthProvider());
    this.emitCurrentLoggedInStatus(true);

    await this.createUser(user);
    return user;
  }

  async loginWithFacebook() {
    let user = await signInWithPopup(this.auth, new FacebookAuthProvider());
    this.emitCurrentLoggedInStatus(true);

    await this.createUser(user);
    return user;
  }

  async createUser(user: UserCredential) {
    if (user) {
      //get display name so we can cut first name
      // and use the remainder as the surname
      let surname: any = user.user.displayName;
      let name = user.user.displayName?.split(' ');

      let q = query(this.userCollection, where('userId', '==', user.user.uid));
      await getDocs(q).then((querySnapshot) => {
        if (!querySnapshot.empty) {
          return;
        } else {
          if (name && user?.user.displayName) {
            surname = surname?.replace(name[0], '');

            setDoc(
              doc(
                this.firestore,
                'users',
                user.user.displayName.replace(/\s+/g, '').toLowerCase()
              ),
              {
                userId: this.getCurrentUser()?.uid,
                username: user.user.displayName
                  .replace(/\s+/g, '')
                  .toLowerCase(),
                name: name[0],
                surname: surname.trim(),
              }
            );
          } else {
            return;
          }
        }
      });
    }
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

  async logout() {
    return await signOut(this.auth).then(() =>
      this.emitCurrentLoggedInStatus(false)
    );
  }
}
