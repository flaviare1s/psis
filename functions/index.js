const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * Cloud Function para deletar um usuário da Firebase Authentication
 * Apenas admins podem chamar esta função
 * Não permite que um usuário delete a si mesmo (use deleteCurrentUser no client)
 */
exports.deleteUserAccount = onCall(async (request) => {
  // Verificar se o usuário está autenticado
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Usuário não autenticado");
  }

  const callerId = request.auth.uid;
  const targetUserId = request.data.userId;

  if (!targetUserId) {
    throw new HttpsError("invalid-argument", "userId é obrigatório");
  }

  // Não permitir que o usuário delete a si mesmo (deve usar deleteCurrentUser)
  if (callerId === targetUserId) {
    throw new HttpsError(
      "invalid-argument",
      "Use deleteCurrentUser para deletar sua própria conta",
    );
  }

  try {
    // Buscar dados do usuário que está chamando a função
    const callerDoc = await admin
      .firestore()
      .collection("usuarios")
      .doc(callerId)
      .get();

    if (!callerDoc.exists) {
      throw new HttpsError(
        "permission-denied",
        "Usuário não encontrado no sistema",
      );
    }

    const callerData = callerDoc.data();

    // Verificar se é admin
    if (callerData.role !== "admin") {
      throw new HttpsError(
        "permission-denied",
        "Apenas administradores podem deletar usuários",
      );
    }

    // Deletar o usuário da Authentication
    await admin.auth().deleteUser(targetUserId);

    // Deletar o documento do Firestore
    await admin.firestore().collection("usuarios").doc(targetUserId).delete();

    return { success: true, message: "Usuário deletado com sucesso" };
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);

    if (error instanceof HttpsError) {
      throw error;
    }

    throw new HttpsError(
      "internal",
      "Erro ao deletar usuário: " + error.message,
    );
  }
});
