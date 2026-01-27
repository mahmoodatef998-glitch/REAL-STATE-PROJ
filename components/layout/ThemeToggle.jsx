"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";

export default function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        );
    }

    const toggleTheme = () => {
        if (theme === "light") setTheme("dark");
        else if (theme === "dark") setTheme("system");
        else setTheme("light");
    };

    return (
        <button
            onClick={toggleTheme}
            className="relative flex items-center justify-center w-10 h-10 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all duration-200 active:scale-95 group focus-ring"
            aria-label="Toggle theme"
        >
            <div className="relative w-5 h-5">
                <Sun
                    className={`absolute inset-0 transition-transform duration-300 ${theme === "light" ? "scale-100 opacity-100" : "scale-0 opacity-0"
                        }`}
                />
                <Moon
                    className={`absolute inset-0 transition-transform duration-300 ${theme === "dark" ? "scale-100 opacity-100" : "scale-0 opacity-0"
                        }`}
                />
                <Monitor
                    className={`absolute inset-0 transition-transform duration-300 ${theme === "system" ? "scale-100 opacity-100" : "scale-0 opacity-0"
                        }`}
                />
            </div>

            {/* Tooltip on hover */}
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none capitalize">
                Theme: {theme}
            </span>
        </button>
    );
}
