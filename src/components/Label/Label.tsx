"use client";

import React, { ReactNode } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
    children: ReactNode;
    className?: string;
}

const Label = ({ children, className = "", ...props }: LabelProps) => {
    return (
        <LabelPrimitive.Root
            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
            {...props}
        >
            {children}
        </LabelPrimitive.Root>
    );
};

export { Label };
