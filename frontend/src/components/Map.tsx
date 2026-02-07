'use client';

interface MapProps {
    lands?: any[];
}

export default function Map({ lands = [] }: MapProps) {
    return (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center p-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">خريطة تفاعلية</p>
                <p className="text-xs text-gray-400">البليدة، الجزائر</p>
            </div>
        </div>
    );
}
