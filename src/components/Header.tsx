"use client";
import { useAuth } from "@/components/AuthProvider";

export const Header = () => {
  const { user, signIn, signOut } = useAuth();

  return (
    <header className="container mx-auto py-4 px-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold">Calculatorul de Salariu și Inflație</h1>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-muted-foreground">Bună, {user.email}</span>
            <button onClick={signOut} className="btn btn-primary">Logout</button>
          </>
        ) : (
          <button onClick={signIn} className="btn btn-primary">Login with Google</button>
        )}
      </div>
    </header>
  );
}