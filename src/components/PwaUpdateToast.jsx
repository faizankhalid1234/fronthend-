import { useEffect, useState } from "react";

function PwaUpdateToast() {
  const [show, setShow] = useState(false);
  const [reload, setReload] = useState(null);

  useEffect(() => {
    import("virtual:pwa-register")
      .then(({ registerSW }) => {
        const update = registerSW({
          onNeedRefresh() {
            setShow(true);
            setReload(() => update);
          },
        });
      })
      .catch(() => {});
  }, []);

  if (!show || !reload) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[95] w-[min(92vw,360px)] -translate-x-1/2 rounded-xl bg-navy px-4 py-3 text-center shadow-lg">
      <p className="text-[13px] font-medium text-white">New version available</p>
      <button
        type="button"
        onClick={() => reload(true)}
        className="mt-2 rounded-full bg-orange px-4 py-1.5 text-[12px] font-bold text-white"
      >
        Refresh App
      </button>
    </div>
  );
}

export default PwaUpdateToast;
