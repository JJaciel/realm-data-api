// GQL Query Resolvers
import { getFirestore, Timestamp } from "firebase-admin/firestore";

const USERS_COLLECTION = "users";

interface UserData {
  userId: string;
  createdAt: Timestamp;
  email: string;
  username?: string;
}

export const UserQuery = {
  getUser: async (
    root: any,
    args: any,
    contextValue: { userId: string },
    info: any
  ) => {
    const { userId } = contextValue;
    const db = getFirestore();
    const userRef = db.collection(USERS_COLLECTION).doc(userId);
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
