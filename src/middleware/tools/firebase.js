import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBl9usGcnKQ5D8frcF8BjsqH-hEd-cJlz8",
  authDomain: "element-1871c.firebaseapp.com",
  projectId: "element-1871c",
  storageBucket: "element-1871c.appspot.com",
  messagingSenderId: "244606989154",
  appId: "1:244606989154:web:7d6bc32861e8fcffde723b",
  measurementId: "G-YEKXWXTBY6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function uploadFile(file, fileName) {
  try {
    const storageRef = ref(storage, `uploads/${fileName}`); // Define la ruta en el storage de Firebase
    await uploadBytes(storageRef, file); // Sube el archivo

    // Construir manualmente el link de visualización
    const storageBucket = firebaseConfig.storageBucket;
    const encodedPath = encodeURIComponent(storageRef.fullPath); // Codifica el path para URL
    const visualizationLink = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${encodedPath}?alt=media`;

    return visualizationLink; // Retorna el link de visualización
  } catch (error) {
    console.error("Error subiendo el archivo:", error);
    throw error;
  }
}