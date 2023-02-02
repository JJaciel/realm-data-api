import { getFirestore, Timestamp } from "firebase-admin/firestore";

const USERS_COLLECTION = "users";

interface UserData {
  userId: string;
  createdAt: Timestamp;
  email: string;
  username?: string;
}

export const UserMutation = {
  updateUserUsername: async (
    root: any,
    args: { username: string },
    contextValue: { userId: string },
    info: any
  ) => {
    const { username } = args;
    const { userId } = contextValue;
    const db = getFirestore();
    const userRef = db.collection(USERS_COLLECTION).doc(userId);
    await userRef.set(
      {
        username: username,
      },
      { merge: true }
    );
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      console.log("No such document!");
      throw new Error("No user found");
    }

    const userData = userDoc.data() as UserData;

    return {
      userId: userData.userId,
      email: userData.email,
      username: userData.username,
    };
  },
};
