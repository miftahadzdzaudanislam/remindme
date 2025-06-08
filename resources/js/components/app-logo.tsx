export default function AppLogo() {
    return (
        <>
            <div className="size-12">
                <img
                    src="/logo remindme.png"
                    alt="Logo"
                    className="h-full w-full object-contain"
                />
            </div>
            <div className="grid flex-1 text-left text-2xl">
                <span className="mb-0.5 truncate leading-none font-extrabold text-[#1E63B0]">RemindMe</span>
            </div>
        </>
    );
}
