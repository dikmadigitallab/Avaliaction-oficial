"use client"

import { useEffect, useState } from "react"
import { CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function AgradecimentoPage() {
  const [step, setStep] = useState<"loading" | "success">("loading")

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep("success")
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#031b1c] text-white">

      <div className="max-w-md w-full text-center">

        <AnimatePresence mode="wait">

          {step === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center gap-8"
            >

              <div className="relative flex items-center justify-center">

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-24 h-24 rounded-full border-2 border-green-400/20"
                />

                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="absolute w-16 h-16 rounded-full border-2 border-green-400 border-t-transparent"
                />

              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm tracking-wide text-green-200"
              >
                Processando sua resposta
              </motion.p>

            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="flex flex-col items-center gap-8"
            >

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 120 }}
              >
                <CheckCircle className="h-20 w-20 text-green-400" />
              </motion.div>

              <motion.h1
                className="text-3xl font-semibold tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Resposta recebida
              </motion.h1>

              <motion.p
                className="text-sm text-green-200 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Obrigado pela sua resposta.
                Seus dados foram enviados com sucesso.
              </motion.p>

              <motion.a
                href="/"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl text-sm font-medium bg-green-400 text-black shadow-lg shadow-green-400/30"
              >
                Voltar ao início
              </motion.a>

            </motion.div>
          )}

        </AnimatePresence>

      </div>

    </div>
  )
}