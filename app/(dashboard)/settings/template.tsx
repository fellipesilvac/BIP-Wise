'use client'

import { motion } from 'framer-motion'

export default function SettingsTemplate({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ ease: 'easeInOut', duration: 0.3 }}
            className="w-full"
        >
            {children}
        </motion.div>
    )
}
