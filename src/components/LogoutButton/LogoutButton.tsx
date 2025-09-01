'use client';

import {logout} from '@/lib/auth/actions.ts';
import styles from "@/components/LogoutButton/LogoutButton.module.css";
import {VscSignOut} from "react-icons/vsc";
import * as React from "react";

export default function LogoutButton() {
    return (
        <button
            className={styles['logout-button']}
            onClick={async () => {
                await logout();
            }}
        >
            <VscSignOut size={16}/>
            Log Out
        </button>
    );
}
