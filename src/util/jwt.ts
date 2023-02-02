import { verify } from "jsonwebtoken";
import { readFileSync } from "fs";

import { getAuthPublicKeyPath } from "./envVars";

export function verifyToken(token: string) {
  const publicKey = readFileSync(getAuthPublicKeyPath());

  const decoded = verify(token, publicKey, { algorithms: ["RS256"] });
  return decoded;
}
