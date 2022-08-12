import { Injectable } from '@angular/core';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  storage = getStorage();

  constructor() {}

  async uploadRecipeImage(file: any, recipeId: string) {
    console.log(recipeId);
    let imagesRef = ref(this.storage, 'recipeImages/' + recipeId);

    return await uploadBytes(imagesRef, file).then((snapshot) => {
      console.log(snapshot);
    });
  }

  downloadRecipeImage(recipeId: string): Promise<string | undefined> {
    let recipeImageRef = ref(this.storage, 'recipeImages/' + recipeId);
    let defaultImageRef = ref(this.storage, 'recipeImages/' + 'empty.jpg');
    let defaultImage: string;
    getDownloadURL(defaultImageRef).then((url) => {
      defaultImage = url.toString();
    });

    //Get the image url:
    return getDownloadURL(recipeImageRef)
      .then((url) => {
        return url.toString();
      })
      .catch((error) => {
        if (error.code == 'storage/object-not-found') {
          return defaultImage;
        }
        return error;
      });
  }

  deleteRecipe(recipeId: string) {
    let recipeImageRef = ref(this.storage, 'recipeImages/' + recipeId);
    return deleteObject(recipeImageRef);
  }
}
