import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
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

/**
 * Envia email para redefinir senha
 */
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Altera a senha do usuário atual
 * Requer reautenticação recente
 */
export async function changePassword(currentPassword, newPassword) {
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error("Usuário não autenticado");
  }

  // Reautenticar o usuário
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);

  // Atualizar a senha
  await updatePassword(user, newPassword);
}
