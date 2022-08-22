import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

import {
  doc,
  setDoc,
  collection,
  updateDoc,
  arrayUnion,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

import { User } from 'src/app/user/models/User';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore, private auth: AuthService) {}

  userCollection = collection(this.firestore, 'users');

  async addUser(username: string, firstName: string, lastName: string) {
    await setDoc(doc(this.firestore, 'users', username), {
      userId: this.auth.getCurrentUser()?.uid,
      username: username.toLowerCase(),
      name: firstName,
      surname: lastName,
    });
  }

  async updateUser(recipeId: string, username?: string) {
    if (username) {
      const userToAddRecipeTo = doc(
        this.firestore,
        'users',
        username.toLowerCase()
      );
      return await updateDoc(userToAddRecipeTo, {
        recipes: arrayUnion(recipeId),
      });
    }

    if (!username) {
      await this.getUsername().then((username) => {
        username = username;

        if (username != null || username != undefined) {
          const userToAddRecipeTo = doc(this.firestore, 'users', username);
          return updateDoc(userToAddRecipeTo, {
            recipes: arrayUnion(recipeId),
          }).then((s) => console.log(s));
        }
        return;
      });
    }
  }

  async getUsername() {
    let q = query(
      this.userCollection,
      where('userId', '==', this.auth.getCurrentUser()?.uid)
    );

    let docsQuery = await getDocs(q);
    let user = docsQuery.docs[0].data() as User;

    return user.username;
  }

  async getUserIdByUsername(username: string) {
    let q = query(this.userCollection, where('username', '==', username));

    let docsQuery = await getDocs(q);
    let user = docsQuery.docs[0].data() as User;

    return user.userId;
  }

  async getUserByUsername(username: string) {
    let q = query(this.userCollection, where('username', '==', username));

    let queryDocs = await getDocs(q);
    return queryDocs.docs[0].data() as User;
  }

  async getUserRecipeIds(userId: string | undefined): Promise<string[]> {
    const q = query(this.userCollection, where('userId', '==', userId));

    const docsQuery = await getDocs(q);
    const user = docsQuery.docs[0].data() as User;
    return user.recipes;
  }

  async userExists(username: string): Promise<boolean> {
    if (username == null) return false;

    let q = query(
      this.userCollection,
      where('username', '==', username.toLowerCase())
    );

    let queryDocs = await getDocs(q);
    if (queryDocs.docs[0]) {
      let user = queryDocs.docs[0].data() as User;

      if (user.username == username) {
        return true;
      } else {
        return false;
      }
    } else return false;
  }

  async getUserNameAndSurname(
    userId: string | undefined
  ): Promise<string | undefined> {
    let q = query(this.userCollection, where('userId', '==', userId));

    let queryDocs = await getDocs(q);
    let user = queryDocs.docs[0].data() as User;

    if (user.name || user.surname) {
      return user.name + ' ' + user.surname;
    } else {
      return user.username;
    }
  }

  getUserRating(): number {
    //actual functionality still has to be implemented once users rate each other

    const genrateRandomNumber = (min: number, max: number) => {
      let min1 = Math.ceil(min);
      let max1 = Math.floor(max);
      return Math.floor(Math.random() * (max1 - min1 + 1)) + min1;
    };

    return genrateRandomNumber(1, 5);
  }
}
