import React from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import AccountPage from "../pages/AccountPage";
import AuthPage from "../pages/AuthPage";

export default function AccountRoute() {
    const { user } = useCurrentUser();
    const isAuthed = !!user?.accessToken;

    return isAuthed ? <AccountPage /> : <AuthPage />;
}