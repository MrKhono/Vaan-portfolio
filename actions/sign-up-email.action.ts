"use server";

import { auth } from "@/lib/auth";

export async function signUpEmailAction(formData: FormData) {
 

  const name = String(formData.get("name"));
  if (!name) return {error: "Entrez un nom"};

  const email = String(formData.get("email"));
  if (!email) return {error: "Entrez un email"};

  const password = String(formData.get("password"));
  if (!password) return {error: "Entrez un mot de passe"};

  try{
    await auth.api.signUpEmail({
        body: {
            name,
            email,
            password
        },
    })
    return {error : null}
  } catch (err){
    if (err instanceof Error) {
       return { error: "Oups ! Il y a un soucis avec l'enregistrement"} 
    }
  }

  return { error: "Erruer du serveur interne"}
}
