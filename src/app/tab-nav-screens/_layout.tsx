import { withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "expo-router/js-top-tabs";
import { useTheme } from "@/src/components/theme-provider";
import { tabLayoutStyles } from "@/src/styles/tab-nav-screens/style";

const Tab = withLayoutContext(createMaterialTopTabNavigator().Navigator);

export default function Layout() {
    const { mode } = useTheme();
    const theme = tabLayoutStyles[mode];
    const tabs = [
        { name: "Agregar", path: "add" },
        { name: "Lista", path: "index" },
        { name: "Editar", path: "edit" }
    ];

    return (
        <Tab
            initialRouteName="index"
            screenOptions={{
                tabBarActiveTintColor: theme.activeLabel.color,
                tabBarInactiveTintColor: theme.inactiveLabel.color,
                tabBarIndicatorStyle: theme.indicator,
                tabBarStyle: theme.bar
            }}
        >
            {tabs.map(({ name, path }) => (
                <Tab.Screen key={path} name={path} options={{ title: name }} />
            ))}
        </Tab>
    );
}
