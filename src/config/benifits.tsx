import { Fuel, Shield, Sofa, Utensils } from "lucide-react";

export const BENEFIT_CONFIG = [
    {
        key: "lounge_access",
        label: "Lounge Access",
        icon: <Sofa className="w-4 h-4" />,
    },
    {
        key: "fuel_benifits",
        label: "Fuel Benefits",
        icon: <Fuel className="w-4 h-4" />,
    },
    {
        key: "dining",
        label: "Dining",
        icon: <Utensils className="w-4 h-4" />,
    },
    {
        key: "insurance",
        label: "Insurance",
        icon: <Shield className="w-4 h-4" />,
    },
];