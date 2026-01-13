export function Loading() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full animate-pulse"></div>
                <div className="relative animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
            <p className="text-gray-500 font-black tracking-[0.3em] uppercase text-[10px] animate-pulse">
                Cargando elementos...
            </p>
        </div>

    )
}