import bcrypt from "bcryptjs";

type PasswordModule = {
  hashPassword: (password: string) => Promise<string>;
  comparePassword?: (
    providePassword: string,
    storedPassword: string,
  ) => Promise<boolean>;
};

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(3);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (
  providePassword: string,
  storedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(providePassword, storedPassword);
};

const password: PasswordModule = {
  hashPassword,
  comparePassword,
};

export default password;
