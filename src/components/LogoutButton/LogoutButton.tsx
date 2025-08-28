'use client';

import { logout } from '@/app/auth/actions.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons";

export default function LogoutButton() {
    return (
        <button
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-all hover:text-gray-900"
            onClick={async () => {
                await logout();
            }}
        >
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
            Logout
        </button>
    );
}
