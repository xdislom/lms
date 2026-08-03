import * as argon2 from 'argon2'

export default async function hashPassword(password: string) {
    return await argon2.hash(password)
}