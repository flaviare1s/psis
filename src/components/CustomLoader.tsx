import logo from "@/assets/logo_psis.jpeg";

export const CustomLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-green-50/95 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-6">
        <div className="animate-bounce">
          <img
            src={logo}
            alt="Logo PSIS"
            className="w-32 h-32 object-contain rounded-2xl shadow-2xl"
          />
        </div>
        <div className="flex gap-2">
          <div
            className="w-3 h-3 bg-green-500 rounded-full animate-pulse"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-3 h-3 bg-green-500 rounded-full animate-pulse"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-3 h-3 bg-green-500 rounded-full animate-pulse"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
};
