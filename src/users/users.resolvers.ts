const userResolver = (
  parent: any,
  args: any,
  contextValue: { userId: string }
) => {
  return {
    userId: contextValue.userId,
    email: "sample@domain.com",
  };
};

export const usersResolvers = {
  Query: {
    user: userResolver,
  },
};
