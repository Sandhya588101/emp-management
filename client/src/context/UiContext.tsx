import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

interface UIContextType {
  confirmAction: (options: ConfirmOptions) => Promise<boolean>;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

interface UIProviderProps {
  children: ReactNode;
}

export function UIProvider({ children }: UIProviderProps) {
  const [confirmation, setConfirmation] =
    useState<ConfirmOptions | null>(null);

  const resolver = useRef<((result: boolean) => void) | null>(null);

  const confirmAction = useCallback(
    (options: ConfirmOptions): Promise<boolean> => {
      resolver.current?.(false);

      return new Promise<boolean>((resolve) => {
        resolver.current = resolve;
        setConfirmation(options);
      });
    },
    []
  );

  const resolveConfirmation = (result: boolean) => {
    resolver.current?.(result);
    resolver.current = null;
    setConfirmation(null);
  };

  return (
    <UIContext.Provider value={{ confirmAction }}>
      {children}

      {confirmation && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-md"
          onClick={() => resolveConfirmation(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirmation-title"
            aria-describedby="confirmation-message"
            className="w-full max-w-md rounded-2xl border border-white/50 bg-white p-6 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-600"
                aria-hidden="true"
              >
                <path d="M10.3 3.9 2.5 17.4A2 2 0 0 0 4.2 20h15.6a2 2 0 0 0 1.7-2.6L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
            </div>

            <h2
              id="confirmation-title"
              className="text-center text-xl font-bold text-slate-800"
            >
              {confirmation.title ?? "Confirm Logout"}
            </h2>

            <p
              id="confirmation-message"
              className="mt-3 text-center text-sm leading-6 text-slate-500"
            >
              {confirmation.message}
            </p>

            <div className="mt-7 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => resolveConfirmation(false)}
                className="min-w-24 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                {confirmation.cancelText ?? "No"}
              </button>

              <button
                type="button"
                onClick={() => resolveConfirmation(true)}
                className="min-w-24 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
              >
                {confirmation.confirmText ?? "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);

  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }

  return context;
}