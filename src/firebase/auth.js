import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./config";
import { getUsuarioByUid, createUsuario } from "./usuarios";

/**
 * Faz login com email e senha
 * @returns {Promise<{user: any, userData: any}>}
 */
export async function signIn(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const userData = await getUsuarioByUid(userCredential.user.uid);
  return { user: userCredential.user, userData };
}

/**
 * Faz logout
 */
export async function signOut() {
  await firebaseSignOut(auth);
}

/**
 * Cria novo usuário com autenticação e documento no Firestore
 * Apenas admins podem criar usuários
 */
export async function createUser(email, password, nome, role) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const uid = userCredential.user.uid;

  // Criar documento do usuário no Firestore
  await createUsuario(uid, { nome, email, role });

  return uid;
}
