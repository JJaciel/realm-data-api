import { getFirestore, Timestamp } from "firebase-admin/firestore";

const USERS_COLLECTION = "users";

interface UserData {
  userId: string;
  createdAt: Timestamp;
  email: string;
  username?: string;
}

const userResolver = async (
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
};

const updateUserUsernameResolver = async (
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
};

export const usersResolvers = {
  Query: {
    user: userResolver,
  },
  Mutation: {
    updateUserUsername: updateUserUsernameResolver,
  },
};
