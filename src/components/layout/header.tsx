"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { ShoppingCart, User, Menu, SunIcon, MoonIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const ThemeToggleButton = ({ className }: { className?: string }) => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className={cn(
        "flex justify-center items-center gap-2 bg-white p-2 rounded-xl text-black dark:bg-zinc-950 dark:text-white",
        className
      )}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <SunIcon
        size={"1.25rem"}
        className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <MoonIcon
        size={"1.25rem"}
        className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};

export default function Header() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Store
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="/products" className="hover:text-primary">
            Products
          </Link>
          <Link href="/categories" className="hover:text-primary">
            Categories
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>

          <ThemeToggleButton />

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/orders">Orders</Link>
                </DropdownMenuItem>
                {session.user.role === "ADMIN" && (
                  <DropdownMenuItem>
                    <Link href="/admin">Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => signOut()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => signIn()}>Sign In</Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden px-4 py-2 space-y-2"
        >
          <Link
            href="/products"
            className="block py-2 hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Products
          </Link>
          <Link
            href="/categories"
            className="block py-2 hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Categories
          </Link>
        </motion.div>
      )}
    </header>
  );
}
