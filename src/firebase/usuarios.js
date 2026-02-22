import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./config";

const COLLECTION = "usuarios";

/**
 * Busca usuário pelo UID do Auth
 */
export async function getUsuarioByUid(uid) {
  const docRef = doc(db, COLLECTION, uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

/**
 * Lista todos os usuários
 */
export async function getUsuarios() {
  const querySnapshot = await getDocs(collection(db, COLLECTION));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Cria novo usuário (documento no Firestore)
 * uid deve ser o mesmo do Firebase Auth
 */
export async function createUsuario(uid, data) {
  const docRef = doc(db, COLLECTION, uid);
  await setDoc(docRef, {
    nome: data.nome,
    email: data.email,
    role: data.role, // "admin" ou "colaborador"
    criadoEm: new Date().toISOString(),
  });
}

/**
 * Atualiza usuário existente
 */
export async function updateUsuario(id, data) {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    atualizadoEm: new Date().toISOString(),
  });
}

/**
 * Deleta usuário (apenas documento do Firestore)
 * Nota: Para deletar a autenticação, use Firebase Admin SDK no backend
 */
export async function deleteUsuario(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}
