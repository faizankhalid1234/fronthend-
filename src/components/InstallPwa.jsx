import { useEffect, useState } from "react";
import { IoClose, IoDownloadOutline } from "react-icons/io5";

function InstallPwa() {
  const [prompt, setPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    setIsStandalone(standalone);

    const onBeforeInstall = (e) => {
      e.preventDefault();
      setPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  if (isStandalone || dismissed || !prompt) return null;

  const handleInstall = async () => {
    await prompt.prompt();
    setPrompt(null);
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[90] mx-auto max-w-[420px] rounded-2xl border border-gray-border bg-white p-4 shadow-[0_8px_30px_rgba(26,35,64,0.15)] sm:left-auto sm:right-6">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange text-lg font-extrabold text-white">
          G
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-bold text-navy">Install Bhandu Khan App</p>
          <p className="mt-0.5 text-[12px] text-gray-muted">
            Add to home screen for fast ordering like a native app.
          </p>
          <button
            type="button"
            onClick={handleInstall}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-orange px-4 py-2 text-[12px] font-bold text-white"
          >
            <IoDownloadOutline className="h-4 w-4" />
            Install App
          </button>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 text-gray-muted hover:text-navy"
          aria-label="Dismiss"
        >
          <IoClose className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default InstallPwa;
