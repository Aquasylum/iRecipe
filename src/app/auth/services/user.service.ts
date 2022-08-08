import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

import {
  addDoc,
  doc,
  setDoc,
  collection,
  getFirestore,
  updateDoc,
  arrayUnion,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { User } from 'src/app/models/User';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore, private auth: AuthService) {}

  userCollection = collection(this.firestore, 'users');

  async addUser(username: string) {
    await setDoc(doc(this.firestore, 'users', username), {
      userId: this.auth.getCurrentUser()?.uid,
      username: username.toLowerCase(),
    });
  }

  async updateUserWithRecipeId(recipeId: string, username?: string) {
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
      const displayName = this.auth.getCurrentUser()?.displayName;
      if (displayName != null || displayName != undefined) {
        const userToAddRecipeTo = doc(this.firestore, 'users', displayName);
        return await updateDoc(userToAddRecipeTo, {
          recipes: arrayUnion(recipeId),
        });
      }
    }
  }

  async userRecipeIds(): Promise<string[]> {
    let user: User = new User();
    const q = query(
      this.userCollection,
      where('userId', '==', this.auth.getCurrentUser()?.uid)
    );

    await getDocs(q).then((querySnapshot) =>
      querySnapshot.forEach((doc) => (user = doc.data() as User))
    );

    return user.recipes;
  }

  async userExists(username: string): Promise<boolean> {
    let user: User = new User();
    let q = query(
      this.userCollection,
      where('username', '==', username.toLowerCase())
    );
    await getDocs(q).then((querySnapshot) =>
      querySnapshot.forEach((doc) => (user = doc.data() as User))
    );

    if (user.username == username) {
      return true;
    } else {
      return false;
    }
  }
}
