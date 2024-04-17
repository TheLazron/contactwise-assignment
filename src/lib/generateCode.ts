import { customAlphabet } from "nanoid";
import { db } from "~/server/db";

const generateNanoId = (): string => {
  const alphabet = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nanoid = customAlphabet(alphabet, 5);
  const generatedId = nanoid();

  return generatedId;
};

const generateOrgCode = async (): Promise<string> => {
  let code;
  let org;

  do {
    code = generateNanoId();
    org = await db.organisation.findFirst({
      where: {
        code: code,
      },
    });
  } while (org);
  return code;
};

export default generateOrgCode;
