import { withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "expo-router/js-top-tabs";

const Tab = withLayoutContext(createMaterialTopTabNavigator().Navigator);

export default function Layout() {
    const tabs = [
        { name: "Agregar", path: "add" },
        { name: "Lista", path: "index" },
        { name: "Editar", path: "edit" }
    ];

    return (
        <Tab
            initialRouteName="index"
            screenOptions={{
                tabBarActiveTintColor: "rgba(13, 134, 9, 0.99)",
                tabBarInactiveTintColor: "rgba(31, 44, 219, 0.42)"
            }}
        >
            {tabs.map(({ name, path }) => (
                <Tab.Screen key={path} name={path} options={{ title: name }} />
            ))}
        </Tab>
    );
}
