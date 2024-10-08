import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC7jWCJ6X5hY5RegG41IyCUGTEuW8y7-l8",
  authDomain: "elemet-commerce.firebaseapp.com",
  projectId: "elemet-commerce",
  storageBucket: "elemet-commerce.appspot.com",
  messagingSenderId: "190062651462",
  appId: "1:190062651462:web:a7d780f1d4021567788247",
  measurementId: "G-M3W3BXMVZL"
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