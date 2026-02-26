import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointerClick, Copy, ToggleRight, Check } from 'lucide-react';

const RemixOverlay: React.FC = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center"
      >
        <div className="relative w-full h-full flex items-center justify-center">

          {/* Balloon 1 - Top left */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-8 left-8 bg-card border border-border rounded-2xl shadow-2xl p-5 max-w-xs"
          >
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                1
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MousePointerClick className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm text-foreground">Abra o menu</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Clique no nome do projeto no canto superior esquerdo para abrir as opções
                </p>
              </div>
            </div>
          </motion.div>

          {/* Balloon 2 - Center-left with menu mockup */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute left-8 top-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl shadow-2xl p-5 max-w-xs"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                2
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Copy className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm text-foreground">Remix this project</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  No menu, clique na opção destacada abaixo
                </p>
              </div>
            </div>

            {/* Mini menu mockup */}
            <div className="bg-background border border-border rounded-lg overflow-hidden text-xs shadow-lg">
              <div className="px-3 py-2 text-muted-foreground hover:bg-muted/30">Settings...</div>
              <div className="px-3 py-2 text-muted-foreground hover:bg-muted/30">Publish</div>
              <div className="px-3 py-2 bg-primary/10 border-l-2 border-primary text-primary font-semibold flex items-center gap-2">
                <Copy className="w-3 h-3" />
                Remix this project
              </div>
              <div className="px-3 py-2 text-muted-foreground hover:bg-muted/30">Share</div>
            </div>
          </motion.div>

          {/* Balloon 3 - Center with modal mockup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-card border border-border rounded-2xl shadow-2xl p-5 max-w-sm w-full"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                3
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ToggleRight className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm text-foreground">Ative e confirme</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Ative o toggle abaixo e clique em OK para criar sua cópia
                </p>
              </div>
            </div>

            {/* Mini modal mockup */}
            <div className="bg-background border border-border rounded-lg overflow-hidden text-xs shadow-lg">
              <div className="px-4 py-3 border-b border-border font-semibold text-foreground">Remix project</div>
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-muted-foreground">Include Custom Knowledge</span>
                {/* Toggle mockup - "on" state */}
                <div className="w-9 h-5 bg-primary rounded-full flex items-center justify-end px-0.5">
                  <div className="w-4 h-4 bg-white rounded-full shadow" />
                </div>
              </div>
              <div className="px-4 py-3 flex justify-end">
                <div className="px-4 py-1.5 bg-primary text-primary-foreground rounded-md font-semibold text-xs cursor-pointer flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  OK
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RemixOverlay;
