'use client';

import {Label} from '@/components/Label/Label.tsx';
import {Input} from '@/components/Input/Input.tsx';
import {Button} from '@/components/Button/Button.tsx';
import {signup} from '@/app/auth/actions.ts';
import {useFormStatus} from 'react-dom';
import React from "react";

export function SignupForm() {
    const [state, action] = React.useActionState(signup, undefined);

    return (
        <form action={action}>
            <div className="flex flex-col gap-2">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" placeholder="John"/>
                </div>
                {state?.errors?.username && (
                    <p className="text-sm text-red-500">{state.errors.username}</p>
                )}
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" placeholder="john@example.com"/>
                </div>
                {state?.errors?.email && (
                    <p className="text-sm text-red-500">{state.errors.email}</p>
                )}
                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password"/>
                </div>
                {state?.errors?.password && (
                    <div className="text-sm text-red-500">
                        <p>Password must:</p>
                        <ul>
                            {state.errors.password.map((error, index) => (
                                <li key={error || index}>- {error}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <SignupButton/>
            </div>
        </form>
    );

    function SignupButton() {
        const {pending} = useFormStatus();

        return (
            <Button aria-disabled={pending} type="submit" className="mt-2 w-full">
                {pending ? 'Submitting...' : 'Sign up'}
            </Button>
        );
    }
}
