import UserModel from "../../models/user";

export async function findByNameAndRoomId(
  userName: string | undefined,
  roomId: string
) {
  const user = (await UserModel.findOne({
    userName: userName,
    activeRoomId: roomId,
  })) as any;
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}
