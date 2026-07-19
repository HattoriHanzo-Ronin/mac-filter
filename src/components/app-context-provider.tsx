import { createContext, PropsWithChildren, useContext } from "react";

interface ContextType {}

const AppContext = createContext<ContextType>({} as ContextType);

export const useAppContext = () => useContext(AppContext);

export default function AppContextProvider(props: PropsWithChildren) {
    const contextValue: ContextType = {};
    return <AppContext.Provider value={contextValue}>{props.children}</AppContext.Provider>;
}
