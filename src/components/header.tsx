import React from 'react';
import { cn } from "@/lib/utils";

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    titulo: string;
    descrição: string;
}

export const Header = ({ titulo, descrição, className, ...props }: HeaderProps) => {
    return (
        <header 
            className={cn(
                "fixed top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur shadow-sm mb-2 animate-fade-in animate-delay-150",
                className
            )}
            {...props}
        >
            <div className="flex h-16 items-center justify-between px-8">
                <div className="flex flex-col justify-center">
                    <h1 className="text-sm font-semibold tracking-tight text-foreground animate-fade-in uppercase tracking-[0.05em]">
                        {titulo}
                    </h1>
                    <p className="text-xs text-muted-foreground animate-fade-in animate-delay-100 line-clamp-1">
                        {descrição}
                    </p>
                </div>

                {/* Slot para ações futuras (Botões, Perfil, etc) */}
                <div className="flex items-center gap-4">
                    {/* Exemplo: <UserNav /> */}
                </div>
            </div>
        </header>
    );
};