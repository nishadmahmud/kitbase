export function SettingRow({ label, children }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-400 flex-shrink-0">{label}</label>
            <div>{children}</div>
        </div>
    );
}

export function SettingInput({ type = "number", value, onChange, ...props }) {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            className="w-[120px] px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-gray-200 outline-none text-right focus:border-blue-500 dark:focus:border-gray-500 transition-colors"
            {...props}
        />
    );
}

import CustomSelect from "@/components/ui/CustomSelect";

export function SettingSelect({ value, onChange, options }) {
    return (
        <div className="w-[180px]">
            <CustomSelect value={value} onChange={onChange} options={options} />
        </div>
    );
}

export default function ToolSettings({ children }) {
    return (
        <div className="mt-6 p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col gap-4 shadow-sm">
            {children}
        </div>
    );
}
