"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Welcome Back</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Sign in to your account
            </p>
          </div>

          <div className="space-y-4">
            <Button
              className="w-full flex items-center justify-center gap-2"
              onClick={() => signIn("github")}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.607,1.972-2.101,3.467-4.26,3.467c-2.624,0-4.747-2.124-4.747-4.747s2.124-4.747,4.747-4.747c1.152,0,2.205,0.401,3.037,1.074l2.363-2.363C17.146,5.012,14.671,4,12.545,4C7.021,4,2.545,8.476,2.545,14s4.476,10,10,10c8.486,0,10.545-7.858,9.852-11.341L12.545,12.151z" />
              </svg>
              Continue with Github
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
