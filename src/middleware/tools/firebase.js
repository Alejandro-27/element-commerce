import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBl9usGcnKQ5D8frcF8BjsqH-hEd-cJlz8",
  authDomain: "element-1871c.firebaseapp.com",
  projectId: "element-1871c",
  storageBucket: "element-1871c.appspot.com",
  messagingSenderId: "244606989154",
  appId: "1:244606989154:web:7d6bc32861e8fcffde723b",
  measurementId: "G-YEKXWXTBY6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function uploadFile(file, fileName) {
  const storageRef = ref(storage, `uploads/${fileName}`); // Almacena el archivo en la carpeta 'uploads'
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref); // Obtén la URL de descarga

  return downloadURL; // Retorna la URL de la imagen subida
}
