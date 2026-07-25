import { neon } from '@neondatabase/serverless'

/*
 * Client Neon initialise paresseusement : si DATABASE_URL est absent
 * (build sans variables d'environnement), l'import ne plante pas.
 * L'erreur ne survient qu'a l'execution d'une requete, et tous les
 * appelants ont un .catch() de repli.
 */
let client = null

export function sql(...args) {
  if (!process.env.DATABASE_URL) {
    return Promise.reject(new Error('[db] DATABASE_URL non defini, les requetes DB echouent'))
  }
  if (!client) client = neon(process.env.DATABASE_URL)
  return client(...args)
}
