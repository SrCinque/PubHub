import db from "@ifra/db.ts";
import password from "@/models/password";
async function create(data: {
  name: string;
  email: string;
  image?: string;
  password?: string;
}) {
  if (data.password) {
    data.password = await password.hashPassword(data.password);
  }
  return await db.user.create({ data });
}

async function update(id: string, data: { name?: string; image?: string }) {
  return await db.user.update({
    where: { id },
    data,
  });
}

async function getById(id: string) {
  return await db.user.findUnique({
    where: { id },
    include: { accounts: true },
  });
}

async function getByEmail(email: string) {
  return await db.user.findUnique({
    where: { email },
    include: { accounts: true },
  });
}

const user = {
  create,
  update,
  getById,
  getByEmail,
};

export default user;
