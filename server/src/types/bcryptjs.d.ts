declare module "bcryptjs" {
    export function hashSync(password: string, salt: number | string): string;
    export function compareSync(password: string, hash: string): boolean;
  }